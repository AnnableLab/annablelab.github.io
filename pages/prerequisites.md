---
layout: default
title: Prerequisites
---

# Prerequisites

In order to run EMHASS, you need to be able to provide the 4 required forecasts (buy/sell electricity prices, solar, and load). In this guide we will use Amber for electricity pricing, and Solcast for solar forecasts, however these are not strict requirements as long as the data can be sourced from somewhere.

## TL;DR

If you want to skip ahead, make sure you have everything listed here installed. Further explanations can be found below.

- [Home Assistant](https://www.home-assistant.io/)
- [HACS Integration](https://www.hacs.xyz/)
- [Sigenergy modbus integration](https://github.com/TypQxQ/Sigenergy-Local-Modbus)
- [Solcast Integration](https://github.com/BJReplay/ha-solcast-solar/tree/main)
- [Amber Electric Integration](https://www.home-assistant.io/integrations/amberelectric/)
- [EMHASS Addon](https://github.com/davidusb-geek/emhass-add-on)
- [ApexCharts Card](https://github.com/RomRider/apexcharts-card) (Optional) 

## Dependencies

You will of course need to have [Home Assistant](https://www.home-assistant.io/) installed along with the [HACS Integration](https://www.hacs.xyz/). HACS provides access to many community written components (i.e. they aren't (yet) in home assistant core).

### Sigenergy Control
In order to read the current state of the solar/battery system, as well as controlling it, we will be using the [Sigenergy modbus integration](https://github.com/TypQxQ/Sigenergy-Local-Modbus).

IMPORTANT: The Sigenergy integration requires that the "ModBus TCP Server" setting has been enabled by your solar installer on each Sigenergy inverter/device. This cannot currently be enabled as just an end user. This can be done remotely by your installer.

You can start in read-only mode if you wish, while setting up the rest and making sure everything is working. However you will need to eventually disable read-only mode in order to be able to automate the control of the battery system.

### Solar forecast
For solar forecasting we will be using the [Solcast Integration](https://github.com/BJReplay/ha-solcast-solar/tree/main). This requires an account and a site setup describing your setup via their website.

Note: They recommend a site-per-string but have a restriction of 2 sites for a free user. If you have more strings you can weighted average them down to 2 (e.g. East and West). It is on my TODO list to give a 4-string example here.

### Pricing forecast

For price forecasting we be using the [Amber Electric Integration](https://www.home-assistant.io/integrations/amberelectric/). This will require an API key that can be obtained via the [amber webapp](https://app.amber.com.au/) (Make sure to enable developer mode).

Note: There is an [amber2mqtt addon](https://github.com/cabberley/amber2mqtt-addon) which boasts quicker price updating. This requires an MQTT server and adds some complexity so we won't be using it for this guide.

### EMHASS Optimizer

Finally the brains of the operation, you'll need to install the [EMHASS Addon](https://github.com/davidusb-geek/emhass-add-on).

The rest of this guide will explain how to run actually configure and operate EMHASS in combination with the above components.

### Graphs
If you wish to generate pretty graph dashboards (recommended), you'll want to install the [ApexCharts Card](https://github.com/RomRider/apexcharts-card).
