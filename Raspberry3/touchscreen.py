from tkinter import *
import tkinter.font as font
import dbConnection
import datetime
from functools import partial
import time
import os
import ledBlinks
from mfrc522 import *
import signal

# Function that checks the correct tag
def rfid_scan():
    labelTitle["text"] = "You need to show your tag first!"
    labelTitle["fg"] = "Red"
    labelTitle.update()

    labelParagraph["text"] = "Please place your tag to the top of the reader..."
    #labelParagraph["fg"] = "Red"
    labelParagraph.update()

    continue_reading = True
    
    # Capture SIGINT for cleanup when the script is aborted
    def end_read(signal,frame):
        global continue_reading
        print ("Ctrl+C captured, ending read.")
        continue_reading = False
    
    # Hook the SIGINT
    signal.signal(signal.SIGINT, end_read)
    
    # Create an object of the class MFRC522
    MIFAREReader = MFRC522()
    
    # Welcome message
    print ("Welcome to the MFRC522 data read example")
    print ("Press Ctrl-C to stop.")
    
    # This loop keeps checking for chips. If one is near it will get the UID and authenticate
    while continue_reading:
        # Scan for cards    
        (status,TagType) = MIFAREReader.MFRC522_Request(MIFAREReader.PICC_REQIDL)
    
        # If a card is found
        if status == MIFAREReader.MI_OK:
            print ("Card detected")
        
        # Get the UID of the card
        (status,uid) = MIFAREReader.MFRC522_Anticoll()
    
        # If we have the UID, continue
        if status == MIFAREReader.MI_OK:
    
            # Print UID
            print ("Card read UID: "+str(uid[0])+","+str(uid[1])+","+str(uid[2])+","+str(uid[3])+','+str(uid[4]))  
            # This is the default key for authentication
            key = [0xFF,0xFF,0xFF,0xFF,0xFF,0xFF]
            
            # Select the scanned tag
            MIFAREReader.MFRC522_SelectTag(uid)
            
            #ENTER Your Card UID here
            my_uid = [199,176,169,199,25]
            
            #Check to see if card UID read matches your card UID
            if uid == my_uid:                #Open the Doggy Door if matching UIDs
                buttonStart.destroy()
                labelTitle["text"] = "Access granted!"
                labelTitle["fg"] = "Green"
                labelTitle.update()

                labelParagraph["text"] = "Loading up the application..."
                labelParagraph.update()

                continue_reading = False
                window.after(3000, orderWindow)
            else:                            #Don't open if UIDs don't match
                buttonStart.destroy()
                labelTitle["text"] = "Tag is not authorized!"
                labelTitle.update()

                labelParagraph["text"] = "Returning to welcome screen..."
                labelParagraph.update()
                continue_reading = False
                window.after(3000, lambda: main(True))

def main(isNewOrder=False):

    if (isNewOrder == False):
        global window
        window = Tk()

        window.geometry("800x480")

        window.attributes("-fullscreen", True)

        # Defining the count (this will be used as a countdown timer when the customer has completed an order and is at the end screen)
        global count
        count = 10
    else:
        # Reset the count back to 10
        count = 10
        for child in window.winfo_children():
            child.destroy()

    # Defining fonts
    global primaryFont
    primaryFont = font.Font(family="Nunito", size=25, weight="bold")
    global secondaryFont
    secondaryFont = font.Font(family="Nunito", size=15, weight="normal")
    global thirdFont
    thirdFont = font.Font(family="Nunito Black", size=15, weight="normal")

    # Defining the background
    bg = PhotoImage(
        file=f"{os.path.dirname(os.path.abspath(__file__))}/blackBgLogo.png")

    global label1
    label1 = Label(window, image=bg, borderwidth=0)
    label1.place(x=0, y=0)

    global labelTitle
    labelTitle = Label(window, text="Welcome!", bg="black",
                       fg="white", font=primaryFont)
    labelTitle.pack(pady=10)

    global labelParagraph
    labelParagraph = Label(window, text="Start a new order below:",
                           bg="black", fg="white", font=secondaryFont)
    labelParagraph.pack(pady=5)

    global totalOrders
    totalOrders = 0

    global buttonFrame
    buttonFrame = Frame(window, bg="black")

    global buttonCart
    buttonCart = Button(
        buttonFrame, text=f"Order amount: {totalOrders}", bg="black", fg="white", font=secondaryFont)
    global buttonReset
    buttonReset = Button(buttonFrame, text="Reset", bg="black",
                         fg="white", font=secondaryFont)

    global buttonStart
    buttonStart = Button(window, text="Start", bg="black",
                         fg="white", font=primaryFont, width=25, command=rfid_scan)
    buttonStart.pack(pady=100)
    
    window.mainloop()

# When the customer wants to reset his purchase, do this:
def resetOrder(cocktailName, cocktailAmountsBase, cocktailDictOfZeroes, cocktailAmounts):
    global totalOrders

    # Reset the cocktailDictOfZeroes key values to 0:
    for cocktail in cocktailDictOfZeroes:
        cocktailDictOfZeroes[cocktailName]["amount"] = 0

    # Reset the totalOrders to 0:
    totalOrders = 0

    # Unpack buttoncart and buttonreset from the UI:
    buttonCart.pack_forget()
    buttonReset.pack_forget()

    # Reset the corresponding cocktail's value to the original base value:
    for cocktail in cocktailAmounts:
        print("cocktail", cocktail)
        cocktailAmounts[cocktail] = cocktailAmountsBase[cocktail]

    # Change the paragraph text back to original:
    labelParagraph["text"] = "No refunds!"


# When the customer clicks any of the buttons to add an order to cart, do this:
def orderAdded(cocktailName, cocktailAmounts, cocktailDictOfZeroes, cocktailAmountsBase):
    global totalOrders
    global buttonCart
    global buttonReset
    global buttonFrame

    # Checking if the current cocktail (that the customer added to the cart) has supplies left.
    # If not then don't minus 1 from the cocktailAmounts dictionary.
    if (cocktailAmounts[cocktailName] != -1):
        cocktailAmounts[cocktailName] -= 1
        if (cocktailAmounts[cocktailName] != -1):
            totalOrders += 1
            cocktailDictOfZeroes[cocktailName]["amount"] += 1

    print("cocktaildictof:", cocktailDictOfZeroes)
    # Below is the shopping validators.
    # User can't, for example, add a product to cart if it's sold out.
    if (cocktailAmounts[cocktailName] >= 0 and totalOrders == 1):
        buttonFrame.pack()
        buttonCart["text"] = f"Order ({totalOrders} drink)"
        buttonCart.pack(padx=10, pady=10, side=LEFT, fill=BOTH)
        buttonReset.pack(padx=10, pady=10, side=LEFT, fill=BOTH)
        print("orders", totalOrders)
    elif (totalOrders > 1 and cocktailAmounts[cocktailName] >= 0):
        buttonCart["text"] = f"Order ({totalOrders} drinks)"
        print("orders", totalOrders)
    elif (cocktailAmounts[cocktailName] == -1 and totalOrders > 1):
        print(cocktailAmounts)
        print(cocktailDictOfZeroes)
        buttonCart["text"] = f"Order ({totalOrders} drinks)"
        labelParagraph["text"] = f"{cocktailName} is all bought out!"
        print(f"{cocktailName} is all bought out!")
    elif (cocktailAmounts[cocktailName] == -1 and totalOrders == 1):
        buttonCart["text"] = f"Order ({totalOrders} drink)"
        labelParagraph["text"] = f"{cocktailName} is all bought out!"
        print(f"{cocktailName} is all bought out!")
    elif (cocktailAmounts[cocktailName] == -1 and totalOrders == 0):
        labelParagraph["text"] = f"{cocktailName} is all bought out!"
        print(f"{cocktailName} is all bought out!")

    # Use winfo_children method to get the corresponding cocktail button (the button that the user clicks to add an order to the cart)
    # We then minus the cocktail from the corresponding cocktail button when the user adds that cocktail to the cart (or in other words, we change the buttons text)
    for child in window.winfo_children():
        for childChild in child.winfo_children():
            for childChildChild in childChild.winfo_children():
                for childChildChildChild in childChildChild.winfo_children():
                    if (type(childChildChildChild) == Button):
                        if (childChildChildChild["text"] == f"{cocktailName} \n left: {cocktailAmounts[cocktailName] + 1} drinks"):
                            childChildChildChild["text"] = f"{cocktailName} \n left: {cocktailAmounts[cocktailName]} drinks"
                            print("Fourth: ", childChildChildChild["text"])

    # Use partial so that tkinter doesn't immediately run the functions that we put in the command value
    transactionDoneArg = partial(transactionDone, cocktailDictOfZeroes)
    resetOrderArg = partial(resetOrder, cocktailName,
                            cocktailAmountsBase, cocktailDictOfZeroes, cocktailAmounts)

    buttonCart["command"] = transactionDoneArg
    buttonReset["command"] = resetOrderArg


# When user the user orders the cocktails, run this:
def orderCompleted(cocktailsBought=0):
    # Delete the frame
    for child in window.winfo_children():
        if (type(child) == Frame):
            child.destroy()

    # Change the label title to let the user know their purchase has gone through
    labelTitle["text"] = "Thank you for your purchase!"

    global count

    # Start the led simulation if count is 10 (in other words at the beginning of this function)
    if (count == 10):
        window.after(100, lambda: ledBlinks.doLedBlinks(cocktailsBought))

    if (count >= 0):
        # If count is 10 and the led simulation is still going on do this:
        if (count == 10):

            # Make a simple estimated waiting time for the customer
            estimatedWaitingTime = 0
            for cocktail in cocktailsBought:
                numberOfBlinks = cocktailsBought[cocktail]["redBlinks"] + \
                    cocktailsBought[cocktail]["greenBlinks"] + \
                    cocktailsBought[cocktail]["blueBlinks"]
                estimatedWaitingTime += numberOfBlinks * \
                    cocktailsBought[cocktail]["amount"]

            labelParagraph[
                "text"] = f"Please wait for your drink(s) to fill up completely... \n \n \n \n \n \n Estimated waiting time: {estimatedWaitingTime} seconds"
            count -= 1

        # After the led simulation is done then change the label paragraph as follows:
        else:
            labelParagraph[
                "text"] = f"All done! \n Remember to drink responsibly :) \n \n \n \n \n \n Returning to the welcome screen in:\n{count}"
            count -= 1

        # After 1 second start this function again (to imitate a countdown timer)
        window.after(1000, orderCompleted)

    # If count is 0 go back to the main function and start over
    else:
        main(True)


def transactionDone(cocktailDictOfZeroes):
    time = datetime.datetime.now()

    day = time.strftime("%d")
    month = time.strftime("%m")
    year = time.strftime("%Y")
    time = time.strftime("%X")

    transactionTime = f"{day}/{month}/{year} {time}"

    # Making a new cocktail dictionary that will have only the cocktails, which the customer bought (amount is greater than 0)
    cocktailsBought = {}

    for cocktailName in cocktailDictOfZeroes:
        if (cocktailDictOfZeroes[cocktailName]["amount"] > 0):
            newBody = {"cocktail": cocktailName,
                       "amount": cocktailDictOfZeroes[cocktailName]["amount"], "pricePerDrink": cocktailDictOfZeroes[cocktailName]["pricePerDrink"], "date": transactionTime}
            newBodyWithBlinks = {"cocktail": cocktailName, "amount": cocktailDictOfZeroes[cocktailName]["amount"],
                                 "redBlinks": cocktailDictOfZeroes[cocktailName]["redBlinks"], "greenBlinks": cocktailDictOfZeroes[cocktailName]["greenBlinks"], "blueBlinks": cocktailDictOfZeroes[cocktailName]["blueBlinks"]}
            cocktailsBought[cocktailName] = newBodyWithBlinks
            dbConnection.transaction(newBody)

    orderCompleted(cocktailsBought)


def orderWindow():
    labelTitle["text"] = "Add cocktails to the cart below:"
    labelTitle["fg"] = "White"
    labelParagraph["text"] = "No refunds!"

    frame = Frame(window, bg="black")

    canvas = Canvas(frame, height=300, bg="black")
    frame2 = Frame(canvas, bg="black")

    scrollbar = Scrollbar(frame, orient="vertical",
                          command=canvas.yview, bg="black")

    canvas.create_window((0, 0), window=frame2, anchor="nw")

    time.sleep(0.5)

    allSupplies = dbConnection.findAllSupplies()

    cocktailAmounts = {}
    cocktailAmountsBase = {}
    cocktailDictOfZeroes = {}
    for cocktail in allSupplies:
        cocktailAmounts[cocktail["cocktail"]] = cocktail["supplyLeft"]
        cocktailAmountsBase[cocktail["cocktail"]] = cocktail["supplyLeft"]
        cocktailDictOfZeroes[cocktail["cocktail"]] = {
            "amount": 0, "pricePerDrink": cocktail["pricePer250ml"], "redBlinks": cocktail["redBlinks"], "greenBlinks": cocktail["greenBlinks"], "blueBlinks": cocktail["blueBlinks"]}

    for supply in allSupplies:
        actionArg = partial(
            orderAdded, supply["cocktail"], cocktailAmounts, cocktailDictOfZeroes, cocktailAmountsBase)
        cocktail = supply["cocktail"]
        cocktail = Button(
            frame2, text=f"{supply['cocktail']} \n Left: {supply['supplyLeft']} drinks \n Price: {supply['pricePer250ml']}€", bg="black", fg="white", font=thirdFont, command=actionArg)
        cocktail.config(highlightthickness=3)
        cocktail.pack(pady=5, fill=BOTH)

    frame2.update()
    canvas.configure(yscrollcommand=scrollbar.set,
                     scrollregion="0 0 0 %s" % frame2.winfo_height())
    canvas.config(highlightthickness=0)

    canvas.pack(side=LEFT)
    scrollbar.pack(side=RIGHT, fill=Y)
    frame.pack()


# run the main function
main()
        
