# from pymongo import *
import pymongo
import json
import time

try:
    client = pymongo.MongoClient(
        host="mongodb+srv://admin:admin@cluster0.obwgt.mongodb.net/automaatti?retryWrites=true&w=majority")
    print("Connection established!")
except pymongo.errors.ConnectionFailure as e:
    print("Connection error: ", e)
except pymongo.errors.ConfigurationError as e2:
    print("Configuration error: ", e2)


automaattiDb = client.automaatti
suppliesCol = automaattiDb.supplies
transactionCol = automaattiDb.orders


def transaction(transactionBody):
    print("transaction body", transactionBody)
    try:
        transactionCol.insert_one(transactionBody)
        print("cocktail:", transactionBody["cocktail"])
        print("supplyLeft:", transactionBody["amount"])
        suppliesCol.find_one_and_update({"cocktail": transactionBody["cocktail"]}, {
                                        "$inc": {"supplyLeft": -transactionBody["amount"]}})
    except pymongo.errors.OperationFailure as e:
        print("Error:", e)


def findAllSupplies():
    suppliesFound = suppliesCol.find()
    supplies = []
    for x in suppliesFound:
        supplies.append(x)
    return supplies
