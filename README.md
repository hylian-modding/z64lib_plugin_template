# z64lib_plugin_template
Template for making Zelda64 mods for ModLoader64 using [Z64Lib](https://github.com/hylian-modding/ML64-Z64Lib)

## Requirements
* [ModLoader64 SDK](https://github.com/hylian-modding/ModLoader64#readme)
* [Z64Lib](https://github.com/hylian-modding/ML64-Z64Lib)
* A compatible ROM (OoT NTSC-U 1.0, OoT Debug, MM NTSC-U 1.0)

## Installing
Clone the repository and run
```
modloader64 -n
```
to initialize the mod project. This should also install Z64Lib automatically and place
it in the "./cores" folder. 

## Building
When you want to build and distribute your mod, run the following
in your mod's root directory:
```
modloader64 -bd
```
If successful, you should have a ".pak" file in "./dist" to 
use outside the SDK

## Testing
If you want to run your project, you can build and run like so:
```
modloader64 -br
```
This will open the emulator with your mod running. If you're running the emulator
for the first time in your project, the emulator will close and produce a "modloader64-config.json"
in your root directory. After setting your ROM and other details correctly in the config,
the next time you run it should be ready for use.

## Examples
[You can find a really basic example of a plugin here](https://github.com/hylian-modding/z64lib_plugin_template/tree/main/src/z64lib_plugin_template_example). 
Hopefully it should explain how a plugin works on a basic level.
If you have any questions regarding developing a plugin and could use some help
with some of ML64's features, feel free to reach out in our discord's #sdk-help channel. 