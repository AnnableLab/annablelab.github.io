---
layout: ../layouts/BaseLayout.astro
title: Dashboard
---

# Dashboard

Here is an example dashboard that uses apex charts to view the energy plan produced by EMHASS. I recommend using it to
verify the energy plan before moving on to full battery automation.

```yaml
views:
  - type: panel
    path: energy-plan
    title: Energy Plan
    cards:
      - type: custom:apexcharts-card
        experimental:
          hidden_by_default: true
        apex_config:
          chart:
            height: auto
        header:
          show: true
          show_states: true
          colorize_states: true
        graph_span: 24h
        span:
          start: minute
          offset: +0h
        all_series_config:
          stroke_width: 2
        yaxis:
          - id: power
            min: -25
            max: 25
            decimals: 0
            apex_config:
              title:
                text: Power (kW)
              forceNiceScale: true
              tick_amount: 4
          - id: soc
            min: -100
            max: 100
            decimals: 0
            show: false
            apex_config:
              title:
                text: Battery State of Charge
              opposite: true
              forceNiceScale: true
              tick_amount: 4
          - id: price
            min: -1
            max: 1
            decimals: 2
            apex_config:
              title:
                text: Price ($)
              opposite: true
              forceNiceScale: true
              tick_amount: 4
        series:
          - entity: sensor.mpc_cost_fun
            unit: $
            invert: true
            float_precision: 0
            name: Cost
            show:
              legend_value: false
              in_chart: false
            transform: return x *-1
            yaxis_id: power
          - entity: sensor.mpc_pv_power
            curve: straight
            type: area
            color: "#fc0"
            extend_to: false
            show:
              in_header: false
              legend_value: false
            unit: kW
            data_generator: |-
              return entity.attributes.forecasts.map((entry) => {
                return [new Date(entry.date), entry.mpc_pv_power/1000];
              });
            yaxis_id: power
          - entity: sensor.mpc_load_power
            curve: stepline
            type: area
            color: "#a0f"
            extend_to: false
            show:
              in_header: false
              legend_value: false
            unit: kW
            data_generator: |-
              return entity.attributes.forecasts.map((entry) => {
                return [new Date(entry.date), -entry.mpc_load_power/1000];
              });
            yaxis_id: power
          - entity: sensor.mpc_grid_power
            curve: stepline
            color: "#1af"
            type: area
            extend_to: false
            show:
              in_header: false
              legend_value: false
            unit: kW
            data_generator: |-
              return entity.attributes.forecasts.map((entry) => {
                return [new Date(entry.date), -entry.mpc_grid_power/1000];
              });
            yaxis_id: power
          - entity: sensor.mpc_batt_power
            curve: stepline
            color: "#00bb84"
            extend_to: false
            show:
              in_header: false
              legend_value: false
            stroke_width: 1
            type: area
            unit: kW
            data_generator: |-
              return entity.attributes.battery_scheduled_power.map((entry) => {
                return [new Date(entry.date), -entry.mpc_batt_power/1000];
              });
            yaxis_id: power
          - entity: sensor.mpc_batt_soc
            type: line
            curve: straight
            stroke_width: 4
            stroke_dash: 4
            color: "#00cc00"
            extend_to: false
            show:
              in_header: false
              legend_value: false
            data_generator: |-
              return entity.attributes.battery_scheduled_soc.map((entry) => {
                return [new Date(entry.date), entry.mpc_batt_soc];
              });
            yaxis_id: soc
          - entity: sensor.mpc_general_price
            stroke_width: 3
            float_precision: 2
            curve: straight
            show:
              in_header: raw
            color: "#4400ff"
            name: Buy Price
            data_generator: |-
              return entity.attributes.unit_load_cost_forecasts.map((entry) => {
                return [new Date(entry.date), entry.mpc_general_price];
              });
            yaxis_id: price
          - entity: sensor.mpc_feed_in_price
            stroke_width: 3
            float_precision: 2
            curve: straight
            show:
              in_header: raw
            color: "#ff00ff"
            name: Sell Price
            data_generator: |-
              return entity.attributes.unit_prod_price_forecasts.map((entry) => {
                return [new Date(entry.date), entry.mpc_feed_in_price];
              });
            yaxis_id: price
        view_layout:
          position: main
```

## Up Next

→ [Battery Automation](/automation)

