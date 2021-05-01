import RPi.GPIO as GPIO
import time

redLed = 20
greenLed = 21
blueLed = 16

GPIO.setmode(GPIO.BCM)
GPIO.setup(redLed, GPIO.OUT)
GPIO.setup(greenLed, GPIO.OUT)
GPIO.setup(blueLed, GPIO.OUT)

GPIO.output(redLed, False)
GPIO.output(greenLed, False)
GPIO.output(blueLed, False)


def doLedBlinks(cocktailsBought):
    for cocktail in cocktailsBought:
        cocktailsBought[cocktail]["redBlinks"] = cocktailsBought[cocktail]["redBlinks"] * \
            cocktailsBought[cocktail]["amount"]
        cocktailsBought[cocktail]["greenBlinks"] = cocktailsBought[cocktail]["greenBlinks"] * \
            cocktailsBought[cocktail]["amount"]
        cocktailsBought[cocktail]["blueBlinks"] = cocktailsBought[cocktail]["blueBlinks"] * \
            cocktailsBought[cocktail]["amount"]
        while cocktailsBought[cocktail]["redBlinks"] > 0:
            GPIO.output(redLed, True)
            time.sleep(0.5)
            GPIO.output(redLed, False)
            time.sleep(0.5)
            cocktailsBought[cocktail]["redBlinks"] -= 1
        while cocktailsBought[cocktail]["greenBlinks"] > 0:
            GPIO.output(greenLed, True)
            time.sleep(0.5)
            GPIO.output(greenLed, False)
            time.sleep(0.5)
            cocktailsBought[cocktail]["greenBlinks"] -= 1
        while cocktailsBought[cocktail]["blueBlinks"] > 0:
            GPIO.output(blueLed, True)
            time.sleep(0.5)
            GPIO.output(blueLed, False)
            time.sleep(0.5)
            cocktailsBought[cocktail]["blueBlinks"] -= 1
