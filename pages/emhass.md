---
layout: default
title: Running EMHASS
---

# Running EMHASS

To run emhass, we want to execute the rest commands we setup earlier with all the parameters they need. In this guide we will use scripts.

You will also need to manually enable these disabled Sigenergy Plant sensors in order for the script to function:

- `sensor.sigen_plant_rated_energy_capacity`
- `sensor.sigen_plant_ess_rated_charging_power`
- `sensor.sigen_plant_ess_rated_discharging_power`

Create a new script from scratch (under Settings -> Automations & Scenes -> Scripts), switch to yaml mode and add the following content:

The critical variables to configure are at the very top.

1. `cost_fun`, this can be either `profit`, `cost` or `self-consumption`, which either maximize profit, minimize cost or maximize self-consumption (selling any excess).
2. `maximum_power_from_grid`, this is the maximum power you can draw from the grid (e.g. when charging your batteries from the grid).
3. `maximum_power_to_grid`, this is the maximum power you can feed into the grid (e.g. when exporting solar, or discharging batteries).
4. `inverter_ac_output_max`, the max AC power your inverter can produce (e.g. A 10kW inverter = 10000)
5. `inverter_ac_input_max`, the max AC power your inverter can consume (The same as the above with Sigenergy inverters)
6. `battery_minimum_state_of_charge_pct`, what percentage (0-100) of your battery you always want to keep as a minimum (e.g. for blackout protection).

```yaml
{% raw %}sequence:
  - variables:
      cost_fun: profit
      maximum_power_from_grid: 15000
      maximum_power_to_grid: 10000
      inverter_ac_output_max: 30000
      inverter_ac_input_max: 30000
      battery_minimum_state_of_charge_pct: 10
    alias: Configure critical settings
  - variables:
      num_prediction_days: 1
      optimization_time_step: 5
      weight_battery_charge: 0.02
      weight_battery_discharge: 0.02
      load_prediction_delta: 1
      sensor_prefix: mpc_
      sensor_name_prefix: "MPC "
    alias: Configure secondary settings
  - variables:
      sensors:
        energy_capacity: sensor.sigen_plant_rated_energy_capacity
        charging_power: sensor.sigen_plant_ess_rated_charging_power
        discharging_power: sensor.sigen_plant_ess_rated_discharging_power
        battery_soc: sensor.sigen_plant_battery_state_of_charge
        consumed_power: sensor.sigen_plant_consumed_power
        pv_power: sensor.sigen_plant_pv_power
        solar:
          day1: sensor.solcast_pv_forecast_forecast_today
          day2: sensor.solcast_pv_forecast_forecast_tomorrow
    alias: Configure sensor entities
  - variables:
      start_time: |-
        {% set offset = timedelta(days=load_prediction_delta) %}
        {{ (now() - offset).isoformat() }}
      end_time: |-
        {% set offset = timedelta(days=load_prediction_delta) %}
        {% set duration = timedelta(days=num_prediction_days) %}
        {{ (now() - offset + duration).isoformat() }}
      battery_nominal_energy_capacity: "{{ (states(sensors.energy_capacity) | float(0) * 1000) | round }}"
      battery_charge_power_max: "{{ (states(sensors.charging_power) | float(0) * 1000) | round }}"
      battery_discharge_power_max: "{{ (states(sensors.discharging_power) | float(0) * 1000) | round }}"
    alias: Calculate variables
  - action: recorder.get_statistics
    data:
      start_time: "{{ start_time }}"
      end_time: "{{ end_time }}"
      statistic_ids: "{{ sensors.consumed_power }}"
      period: hour
      types: mean
    response_variable: history
    alias: Fetch load history
  - variables:
      num_forecasts: "{{ (60 / optimization_time_step * 24 * num_prediction_days) | int }}"
      soc_init: "{{ (states(sensors.battery_soc) | float(0) / 100) | round(3) }}"
      soc_final: "{{ battery_minimum_state_of_charge_pct / 100 }}"
      load_history: |-
        {% set ns = namespace(
          input=history.statistics[sensors.consumed_power],
          output={
            now().isoformat(): (states(sensors.consumed_power) | float(0) * 1000) | round(0)
          }
        ) %}
        {% for load in ns.input %}
          {% set load_start = load.start | as_datetime | as_local + timedelta(days=load_prediction_delta) %}
          {% set load_value_watts = (load.mean | float(0) * 1000) | round(0) %}
          {% set ns.output = ns.output | combine({ load_start.isoformat(): load_value_watts }) %}
        {% endfor %}
        {{ ns.output }}
      load_cost: |-
        {% set ns = namespace(
          input=(
              state_attr('sensor.home_general_forecast', 'forecasts') | list
          ) | selectattr('per_kwh', 'is_number') | list,
          output={
            now().isoformat(): states('sensor.home_general_price') | float(0)
          }
        ) %}
        {% for day in range(num_prediction_days) %}
          {% for forecast in ns.input %}
            {% set start = forecast.start_time | as_datetime | as_local + timedelta(days=day) %}
            {% set price = forecast.per_kwh | float(0) %}
            {% set ns.output = ns.output | combine({ start.isoformat(): price }) %}
          {% endfor %}
        {% endfor %}
        {{ ns.output }}
      prod_price: |-
        {% set ns = namespace(
          input=(
              state_attr('sensor.home_feed_in_forecast', 'forecasts') | list
          ) | selectattr('per_kwh', 'number') | list,
          output={
            now().isoformat(): states('sensor.home_feed_in_price') | float(0)
          }
        ) %}
        {% for day in range(num_prediction_days) %}
          {% for forecast in ns.input %}
            {% set start = forecast.start_time | as_datetime | as_local + timedelta(days=day) %}
            {% set price = forecast.per_kwh | float(0) %}
            {% set ns.output = ns.output | combine({ start.isoformat(): price }) %}
          {% endfor %}
        {% endfor %}
        {{ ns.output }}
      pv_power: |-
        {% set ns = namespace(
          input=(state_attr(sensors.solar.day1, 'detailedForecast') | list
            + state_attr(sensors.solar.day2, 'detailedForecast') | list)
            | selectattr('period_start','>', now())
            | selectattr('period_start','<=', now() + timedelta(days=num_prediction_days)),
          output={
            now().isoformat(): (states(sensors.pv_power) | float(0) * 1000) | round
          }
        ) %}
        {% for solar in ns.input %}
          {% set key = solar.period_start.isoformat() %}
          {% set value = (solar.pv_estimate * 1000) | round %}
          {% set ns.output = ns.output | combine({ key: value }) %}
        {% endfor %}
        {{ ns.output }}
      payload_common: |-
          "cost_fun": "{{ cost_fun }}",
          "prediction_horizon": {{ num_forecasts }},
          "optimization_time_step": {{ optimization_time_step }},
          "set_use_pv": true,
          "set_use_battery": true,
          "inverter_is_hybrid": true,
          "number_of_deferrable_loads": 0,
          "set_nodischarge_to_grid": false
      payload: |-
        {
          {{ payload_common }},
          "load_power_forecast": {{ load_history | to_json }},
          "load_cost_forecast": {{ load_cost | to_json }},
          "prod_price_forecast": {{ prod_price | to_json }},
          "pv_power_forecast": {{ pv_power | to_json }},
          "weight_battery_charge": {{ weight_battery_charge }},
          "weight_battery_discharge": {{ weight_battery_discharge }},
          "battery_minimum_state_of_charge": {{ battery_minimum_state_of_charge_pct / 100 }},
          "battery_nominal_energy_capacity": {{ battery_nominal_energy_capacity }},
          "battery_charge_power_max": {{ battery_charge_power_max }},
          "battery_discharge_power_max": {{ battery_discharge_power_max }},
          "maximum_power_from_grid": {{ maximum_power_from_grid }},
          "maximum_power_to_grid": {{ maximum_power_to_grid }},
          "inverter_ac_output_max": {{ inverter_ac_output_max }},
          "inverter_ac_input_max": {{ inverter_ac_input_max }},
          "soc_init": {{ soc_init }},
          "soc_final": {{ soc_final }}
        }
    alias: Calculate payload
  - action: rest_command.emhass_naive_mpc_optim
    metadata: {}
    data:
      payload: "{{ payload }}"
    alias: Run EMHASS
  - variables:
      payload: |-
        {
          {{ payload_common }},
          "custom_pv_forecast_id": {
            "entity_id": "sensor.{{ sensor_prefix }}pv_power",
            "unit_of_measurement": "W",
            "device_class": "power",
            "friendly_name": "{{ sensor_name_prefix }}PV Power"
          },
          "custom_load_forecast_id": {
            "entity_id": "sensor.{{ sensor_prefix }}load_power",
            "unit_of_measurement": "W",
            "device_class": "power",
            "friendly_name": "{{ sensor_name_prefix }}Load Power"
          },
          "custom_hybrid_inverter_id": {
            "entity_id": "sensor.{{ sensor_prefix }}inverter_power",
            "unit_of_measurement": "W",
            "device_class": "power",
            "friendly_name": "{{ sensor_name_prefix }}Inverter Power"
          },
          "custom_batt_forecast_id": {
            "entity_id": "sensor.{{ sensor_prefix }}batt_power",
            "unit_of_measurement": "W",
            "device_class": "power",
            "friendly_name": "{{ sensor_name_prefix }}Battery Power"
          },
          "custom_grid_forecast_id": {
            "entity_id": "sensor.{{ sensor_prefix }}grid_power",
            "unit_of_measurement": "W",
            "device_class": "power",
            "friendly_name": "{{ sensor_name_prefix }}Grid Power"
          },
          "custom_batt_soc_forecast_id": {
            "entity_id": "sensor.{{ sensor_prefix }}batt_soc",
            "unit_of_measurement": "%",
            "device_class": "battery",
            "friendly_name": "{{ sensor_name_prefix }}Battery SOC"
          },
          "custom_cost_fun_id": {
            "entity_id": "sensor.{{ sensor_prefix }}cost_fun",
            "unit_of_measurement": "$",
            "device_class": "monetary",
            "friendly_name": "{{ sensor_name_prefix }}Cost Function"
          },
          "custom_unit_load_cost_id": {
            "entity_id": "sensor.{{ sensor_prefix }}general_price",
            "unit_of_measurement": "$",
            "device_class": "monetary",
            "friendly_name": "{{ sensor_name_prefix }}Buy Price"
          },
          "custom_unit_prod_price_id": {
            "entity_id": "sensor.{{ sensor_prefix }}feed_in_price",
            "unit_of_measurement": "$",
            "device_class": "monetary",
            "friendly_name": "{{ sensor_name_prefix }}Sell Price"
          },
          "custom_optim_status_id": {
            "entity_id": "sensor.{{ sensor_prefix }}optim_status",
            "unit_of_measurement": "",
            "friendly_name": "{{ sensor_name_prefix }}Optimisation Status"
          }
        }
  - action: rest_command.emhass_publish_data
    metadata: {}
    data:
      payload: "{{ payload }}"
    alias: Publish Energy Plan to HA
alias: Generate EMHASS Energy Plan (MPC)
description: "Runs EMHASS MPC optimizer, generating an optimal energy plan"{% endraw %}
```

If you run this script, EMHASS will produce a plan for the day. You should be able to manually run the script and check the output in the EMHASS webview. We will also be adding our own output dashboard later.

You'll want to be running this script regularly as forecasts change throughout the day, so the next step is to setup a new automation:

```yaml
{% raw %}alias: "Generate EMHASS energy plan"
description: "Automatically generate EMHASS energy plan when prices change"
triggers:
  - trigger: state
    entity_id:
      - sensor.home_general_price
      - sensor.home_feed_in_price
    enabled: true
  - trigger: time_pattern
    minutes: "*"
    hours: "*"
conditions: []
actions:
  - action: script.generate_emhass_energy_plan_mpc
    metadata: {}
    data: {}
mode: single{% endraw %}
```

This will run every time the prices change and every minute to account for live solar / usage power changes.

Note: On my Intel NUC server, EMHASS takes a couple seconds to run. You may want to reduce the frequency on lower end hardware.

## Up Next

→ [Dashboard Setup](/pages/dashboard)
