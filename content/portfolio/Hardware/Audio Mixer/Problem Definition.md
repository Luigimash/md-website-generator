I wish to develop an analog audio mixer all-in-one solution that is custom designed with features for use to manage **caster audio**, ultimately to a USB audio interface. Designed specifically for our school’s broadcast scenario, where we have two mic inputs + 2 headphone inputs, which need to be set to a different mix so that they can hear the game without game feeding back to the streaming laptop.

Some of the features it will require:

- **Individual cough & talkback buttons** on the mixer, facing the casters
    - Can also add I/O screw terminals on the PCB for extended functionality maybe? or maybe a literal two-wire signal port for plugging in extra buttons?
- **Line outputs for individual microphone inputs,** need to check if these are balanced/differential or if they are stereo
    - 1/4” jacks, literally a 1:1 feed out
- **Master, Caster, Director mix outputs**, with digital controls (on/off buttons & individual gain control) for sending audio from each input channel to each output
    - Two 1/4” monitor outputs for both (headphone level, not speaker level)
- **Four input channels**, two for XLR caster microphones (non condenser) and one for 1/4” TRS balanced (differential) audio input
    - All inputs will be considered/assumed to be differential balanced cable audio, mono
    - No support for phantom power
- **Master & Caster mix volume level LEDs** (everything is assumed mono so one line of LEDs for both)
- Ideally powered by USB-C port, for now can design with barrel jack w/ known power supply but change it to USB-C port + minimum wattage brick later
- Appropriate potentiometers & faders for controlling volume and gain at every relevant stage
    - basically copy the UW mixer setup in terms of pots for pre-amp and faders for mix control
    - pots for aux mix, faders for master mix
    - only difference, have two output faders, one for master and one for casters