---
layout: default
title: Running EMHASS
permalink: /emhass/
---

# Running EMHASS

To run emhass, we want to execute the rest commands we setup earlier with all the parameters they need. In this guide we will use scripts.

You will also need to manually enable these disabled Sigenergy Plant sensors in order for the script to function:

- `sensor.sigen_plant_rated_energy_capacity`
- `sensor.sigen_plant_ess_rated_charging_power`
- `sensor.sigen_plant_ess_rated_discharging_power`
- `sensor.sigen_plant_max_active_power`

Solcast by default only enables today and tomorrow solar forecast sensors, meaning at 11pm you'll only get 25 hours of forecasting. You will need to enable the solcast day 3 forecast sensor to always provide 2 full days of solar forecasting (and if you want longer horizons, you can enable up to 7 days and add them to the forecasts list within the script).

- `sensor.solcast_pv_forecast_forecast_day_3`

Next, create a new script from scratch (under Settings -> Automations & Scenes -> Scripts), switch to yaml mode and add the content below.

The critical variables to configure are at the very top.

1. `costfun` — this can be either `profit`, `cost` or `self-consumption`, which either maximize profit, minimize cost or maximize self-consumption (selling any excess).
    - UPDATE: There is a currently an [open issue](https://github.com/davidusb-geek/emhass/issues/559) within EMHASS preventing this parameter from working correctly. For now you will need to set it via the EMHASS Config editor.
2. `maximum_power_from_grid` — this is the maximum power you can draw from the grid (e.g. when charging your batteries from the grid).
3. `maximum_power_to_grid` — this is the maximum power you can feed into the grid (e.g. when exporting solar, or discharging batteries).
4. `battery_minimum_percent` — what percentage (0-100) of your battery you always want to keep as a minimum (e.g. for blackout protection).

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

→ [Dashboard Setup](/dashboard/)
