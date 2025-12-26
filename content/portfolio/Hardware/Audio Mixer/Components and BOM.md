### TL071, TL072, TL074 Op-Amp

- 2.25 - 20V power supply input
- [https://www.ti.com/product/TL072H](https://www.ti.com/product/TL072H)
- TL071, TL072, TL074 is single, dual, quad opamp
- TL07x series is specced for low noise typically (need a source)

### 24V DC Power Supply Brick

- Converts wall outlet output to 24V DC
- lowkey dont know if I need this high voltage but lets do this for now
- [https://www.amazon.ca/Supply-Adapter-100-240V-Security-Upgrade/dp/B0BPLR1N6Y/ref=sr_1_5?keywords=24V%2BPower%2BSupply&qid=1702174716&sr=8-5&th=1](https://www.amazon.ca/Supply-Adapter-100-240V-Security-Upgrade/dp/B0BPLR1N6Y/ref=sr_1_5?keywords=24V%2BPower%2BSupply&qid=1702174716&sr=8-5&th=1)

### 12V DC-DC Dual Rail Switching

- i need to find something for this or just steal a schematic online and use it in a hypothetical scenario

### Dual Gang Potentiometer(?) 1KOhms

- [https://www.mouser.ca/ProductDetail/Alpha-Taiwan/RV122F-20-15F-A1K-0072?qs=8%252Br4Hz5Xir%2FNkfIEtiaRVA%3D%3D](https://www.mouser.ca/ProductDetail/Alpha-Taiwan/RV122F-20-15F-A1K-0072?qs=8%252Br4Hz5Xir%2FNkfIEtiaRVA%3D%3D)
- 5% tolerance for better performance
- used in:
    - initial input channel gain
        - jk might make initial input channel gain determined by fixed resistors so that it can be sent to line output

### Analog 1:1 IC switch (basically a mute button)

- [https://www.digikey.ca/en/products/detail/texas-instruments/SN74LVC1G66DCKR/484847](https://www.digikey.ca/en/products/detail/texas-instruments/SN74LVC1G66DCKR/484847)
- its perfect …

**LM3915 - IC for Analog Volume Meter**

- [https://www.homemade-circuits.com/lm3915-ic-datasheet-pinout-application-circuits/](https://www.homemade-circuits.com/lm3915-ic-datasheet-pinout-application-circuits/)
- [https://www.digikey.ca/en/products/detail/texas-instruments/LM3914V-NOPB/212685](https://www.digikey.ca/en/products/detail/texas-instruments/LM3914V-NOPB/212685)
- Using a 6.2kohm resistor tying Ref Out to GND because when Ref ADJ = GND, then Ref Out = 1.25V nominal, and 2mA of current is needed per resistor. Appx 10x the current pulled from Ref Out is the current supplied to each LED, so using V=IR with V=1.25V and I=0.2mA we get a 6.2kohm resistor
![[LM3914_screenshot.jpg]]

### 5K Logarithmic Taper Rotary Potentiometer (gain knobs)

[https://www.taydaelectronics.com/5k-ohm-logarithmic-taper-potentiometer.html](https://www.taydaelectronics.com/5k-ohm-logarithmic-taper-potentiometer.html)

- would use Digikey but might as well match the linear pots, plus this is way cheaper, and tolerances don’t matter at all (as far as i know if its 4k or 6k ohms we’ll still be fine lol)

### 5K Logarithmic Taper Slide Potentiometer (audio fader)

[https://www.taydaelectronics.com/ra6020f-a5k-ohm-logarithmic-taper-slide-potentiometer.html](https://www.taydaelectronics.com/ra6020f-a5k-ohm-logarithmic-taper-slide-potentiometer.html)

- I wanted a Digikey one but they’re all linear taper for some reason lol

### Female XLR PCB mount receptacle

- [Datasheets](https://www.neutrik.com/en/product/nc3faav1)
- [Purchase](https://www.mouser.ca/ProductDetail/Neutrik/NC3FAAV1?qs=jCymNF74TgWOIsVH73GEhA%3D%3D)

### Female 1/4” PCB Mount receptacle

- [Datasheets](https://www.neutrik.com/en/product/nj3fd-v)
- [Purchase](https://www.mouser.ca/ProductDetail/Neutrik/NJ3FD-V?qs=JfNPhaIww3IZW5co%2FIYJ8A%3D%3D)

### Green, Yellow, Red, LED 10 packs each

- [Green](https://www.pishop.ca/product/diffused-green-5mm-led-10-pack/)
- [Yellow](https://www.pishop.ca/product/diffused-yellow-5mm-led-10-pack/)
- [Red](https://www.pishop.ca/product/diffused-red-5mm-led-10-pack/)

### 5V 2A Power Supply brick w/ standard 2.1mm jack

[https://www.pishop.ca/product/5v-2a-2000ma-switching-power-supply-ul-listed-2/](https://www.pishop.ca/product/5v-2a-2000ma-switching-power-supply-ul-listed-2/)

- corresponding barrel jack [https://www.mouser.ca/ProductDetail/Gravitech/CON-SOCJ-2155?qs=fkzBJ5HM%252BdCcpvFQyQZHtA%3D%3D](https://www.mouser.ca/ProductDetail/Gravitech/CON-SOCJ-2155?qs=fkzBJ5HM%252BdCcpvFQyQZHtA%3D%3D)
- might need to change to 9v

### 2200uf capacitor for low pass filtering the PSU input

[https://www.digikey.ca/en/products/detail/rubycon/10PX2200MEFC10X16/3133988](https://www.digikey.ca/en/products/detail/rubycon/10PX2200MEFC10X16/3133988)

### Latching On-Off Logic Switch SPST

[https://www.digikey.ca/en/products/detail/carling-technologies/110-P/696604](https://www.digikey.ca/en/products/detail/carling-technologies/110-P/696604)

### AC-DC Switching Power Supply Board Module AC110V 220V 230V to DC ±5V ±12V ±15V

[https://www.ebay.ca/itm/263196999929?mkcid=16&mkevt=1&mkrid=711-127632-2357-0&ssspo=qbAJ5icsSjG&sssrc=2047675&ssuid=&var=564896020399&widget_ver=artemis&media=COPY](https://www.ebay.ca/itm/263196999929?mkcid=16&mkevt=1&mkrid=711-127632-2357-0&ssspo=qbAJ5icsSjG&sssrc=2047675&ssuid=&var=564896020399&widget_ver=artemis&media=COPY)

based from this video [https://www.youtube.com/watch?v=4tDdUWh36bQ](https://www.youtube.com/watch?v=4tDdUWh36bQ)