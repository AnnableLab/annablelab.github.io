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

Create a new script from scratch (under Settings -> Automations & Scenes -> Scripts), switch to yaml mode and add the content below.

The critical variables to configure are at the very top.

1. `cost_fun` — this can be either `profit`, `cost` or `self-consumption`, which either maximize profit, minimize cost or maximize self-consumption (selling any excess).
2. `maximum_power_from_grid` — this is the maximum power you can draw from the grid (e.g. when charging your batteries from the grid).
3. `maximum_power_to_grid` — this is the maximum power you can feed into the grid (e.g. when exporting solar, or discharging batteries).
4. `inverter_ac_output_max` — the max AC power your inverter can produce (e.g. A 10kW inverter = 10000)
5. `inverter_ac_input_max` — the max AC power your inverter can consume (The same as the above with Sigenergy inverters)
6. `battery_minimum_percent` — what percentage (0-100) of your battery you always want to keep as a minimum (e.g. for blackout protection).

{% highlight yaml %}
{% include emhass_script.yaml %}
{% endhighlight %}

If you run this script, EMHASS will produce a plan for the day. You should be able to manually run the script and check the output in the EMHASS webview. We will also be adding our own output dashboard shortly.

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

Note: On my Intel NUC Home Assistant server, this script takes a couple of seconds to run. If you are running lower end hardware you may want to either increase the optimization time step or reduce the running frequency.

## Up Next

→ [Dashboard Setup](/pages/dashboard)
