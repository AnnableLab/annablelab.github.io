---
layout: default
title: Automation & Scheduling
---

# Automated Battery Control

EMHASS by itself just creates the energy plan, but it won't actually know how to execute upon it. In
order to execute the plan, we will need an automation.

Note: Make sure the Sigenergy integration is no longer in Read-Only Mode, as we will now be changing
values automatically! You will also have to turn
`switch.sigen_plant_remote_ems_controled_by_home_assistant` on (Important: This will disable Amber
SmartShift, which as of this writing you cannot currently turn back on without contacting Amber).

This automation switches the Sigenergy battery system between 4 operating modes depending on the
energy plan:

1. Maximum Self Consumption
2. Command Discharging (PV First)
3. Command Charging (PV First)
4. Standby

Using just these 4 modes and modulating various charge and discharge limits we can achieve a great deal!

You will also need to manually enable these disabled Sigenergy Plant sensors in order for the script to function:

- `select.sigen_plant_remote_ems_control_mode`
- `number.sigen_plant_ess_max_charging_limit`
- `number.sigen_plant_ess_max_discharging_limit`
- `number.sigen_plant_pcs_import_limitation`
- `number.sigen_plant_pv_max_power_limit`

{% highlight yaml %}
{% include battery_automation.yaml %}
{% endhighlight %}

### Curtailment

You will also want an automation to automatically handle negative prices. This automation will prevent selling PV at a negative feed-in price, and will also prevent using solar when there is a negative general price (as you'll make more money drawing from the grid instead).

{% highlight yaml %}
{% include curtailment.yaml %}
{% endhighlight %}
