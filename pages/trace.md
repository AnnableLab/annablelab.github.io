---
layout: default
title: Trace Downloading
permalink: /trace
---

# Trace Downloading

The EMHASS script trace is a JSON file which contains all the information sent to EMHASS from Home Assistant. It is
great for debugging as you can verify that all the sensors are working and that the data sent to EMHASS is correct.

1. Open the Generate EMHASS Energy Plan script (note: not the automation)
2. Click the Traces icon up the top right
3. Click the 3 dots up the top right
4. Click Download trace

<p align="center">
  <img src="/assets/img/download_trace.png" alt="Download Trace Screenshot" width="800">
</p>

## Common Issues

### 1. Invalid inverter settings

Under `sequence/5` there should be a payload that should start with all the inverter parameters. e.g.

```
"battery_charge_power_max": 46200,
"battery_discharge_power_max": 52800,
"maximum_power_from_grid": 30000,
"maximum_power_to_grid": 30000,
"inverter_ac_output_max": 59998,
"inverter_ac_input_max": 59998,
```

Make sure these all have values and they are in watts.

### 2. Invalid current Load/Price/PV

Check the first value under all these lists of values:

1. `load_cost_forecast`
2. `prod_price_forecast`
3. `load_power_forecast`
4. `pv_power_forecast`

Make sure they look correct and valid.
