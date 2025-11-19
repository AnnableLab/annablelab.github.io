---
layout: default
title: EMHASS Setup
permalink: /setup
redirect_from:
  - /pages/setup/
  - /pages/setup.html
---

# EMHASS Setup

### Configuration

Unfortunately, EMHASS has a long and confusing configuration page, many of which are not actually required.

Thankfully we can completely ignore the EMHASS configuration page, so just leave it as default. We will be overriding
the values we care about later when running EMHASS. If you have already configured things, don't worry, it won't matter.

### Running EMHASS from Home Assistant

Since EMHASS is an addon, we need a communication system to run commands. One simple way is to use rest commands which
we will setup below.

You'll need access to your home assistant configuration files, I recommend the official
[vscode addon](https://github.com/hassio-addons/addon-vscode).

If you have not setup packages yet, create a `packages` directory alongside `configuration.yaml`, and then add this to
your home assistant `configuration.yaml` file:

```
homeassistant:
  packages: !include_dir_named packages
```

Inside the `packages` directory, create a file named `emhass.yaml` with the following content:

{% highlight yaml %} {% include emhass.yaml %} {% endhighlight %}

Then restart home assistant.

These are the 3 emhass actions we will now be able to execute from home assistant. In this guide we will only use the
last two. They all take a payload as a parameter, which will later include all the required information such as the
forecasts and solar/battery specs.

## Up Next

→ [Running EMHASS](/emhass)
