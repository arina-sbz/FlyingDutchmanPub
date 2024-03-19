# FlyingDutchmanPub
DEPENDENCIES:
Run in Chrome browser for best results.
Login Credentials:
    STAFF
    username: "bartender"
    password: "123456"

    VIP
    username: "arina"
    password: "123456"


START FILES:
Run index.html to view the webpage in desktop browser.
Open inspector and select tablet view to experience responsive design.


CHATBOT DISCLOSURE:
CoPilot:
    -Commented code to provide meaningful descriptions of functions
    -Helped repair function logic
ChatGPT:
    -Provided snippets of code to debug undo issues when the arrow would disappear on click
    -Taught how to activate the language change for the alert message
    -Debugged recurring errors


TIME REPORTING:
Ahmad: 40 hours
Arina: 55 hours
Claude: 50 hours
Shiqi: 60 hours


FULFILLED REQUIREMENTS
ALL CUSTOMERS:
See available items (open menu)
Order beverages from servicing bartender at the table
Single order/bill
Change order
Pay at bar, or to bartender/waiter/waitress at table

VIP CUSTOMERS:
Simple log in (at table)
Log out
Order and Pay from account (at table)
Fetch special beer/drink from fridge or bar


ALL STAFF:
Simple log in
Log out
See availability of products
Display # of remaining servings
The bartender should immediately be notified when an item is running low
Notify security of problem
    accessible within 3 seconds
Get order for certain table
Change items on order

GENERAL:
Create dictionary with 3 languages (NO hard-coded strings!!!)
    English
    Swedish
    Dutch
We need to be able to find products according to content
    Allergies - Gluten, Nuts, Lactose etc.
    Alcohol content
    Tannins (for wine)
Order amount constraints with warnings
    min 5
    max 10
The interface must connect to the thematic background of the Pub
Drinks should be listed with (and filtered by) the following details:
    Beers
        Name
        Producer/Brewery
        Country
        Type (IPA, lager)
        Strength
        Serving size (tap, bottle)
        Price
    Wine
        Name
        Year
        Producer
        Type
        Grape
        Serving size (glass, bottle)c.
    Cocktails/Drinks
        Name
        Strength
        Contents/Recipe (for allergy purposes)
        Serving size
        Food (presented on separate menu)
        Name of platter
        Ingredients
        Price


NOTES/HINTS:
Resize between views (no gradual change needed)
    9’’ display for customers and staff on the move
    27” – 30” large screen for staff at the bar
Use MVC (or a similar version)
Three distinct interface languages
Dynamically changeable
Remember choice over the whole session
The system should implement Drag and Drop for all suitable actions
All DND functions should also have an alternative way to initiate (button/menu)
The system should implement an UNDO/REDO functionality
At least 3 different actions should be undoable (add to/remove from/empty/delete order)
    The undo should be “unlimited”.
Debugged system
Well documented (minimum according to the posted description).
System can run nicely on one platform you choose, on one browser you choose


GITHUB REPOSITORY:
https://github.com/arina-sbz/FlyingDutchmanPub