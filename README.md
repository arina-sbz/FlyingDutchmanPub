# FlyingDutchmanPub


DEPENDENCIES:
(external libraries, frameworks, or packages that your project relies on to function properly.)
...


START FILES:
Run index.html to view the webpage in desktop browser.
Open inspector and select tablet view to experience responsive design.


CHATBOT DISCLOSURE:
CoPilot:
...
ChatGPT:
Provided snippets of code to debug Undo-Redo issues when arrows would disappear on click




TIME REPORTING:
Ahmad: ...hours
Arina: ...hours
Claude: ...hours
Shiqi: ...hours


REQUIREMENTS
ALL CUSTOMERS:
See available items (open menu)
Order beverages and simple food from servicing bartender at the table
Single order/bill
Group order/bill
Change order
Pay at bar, or to bartender/waiter/waitress at table
**new amount can simply be entered (no card reader/Swish/etc should be implemented)
splitting the bill
VIP CUSTOMERS:
Simple log in (at table)
Log out
Order food
See account balance (at table)
Order and Pay from account (at table)
Fetch special beer/drink from fridge or bar
with combination lock
code is changed between purchases
Add to account (at bar)


ALL STAFF:
Simple log in
Log out
See availability of products
Display # of remaining servings
Ability to remove product (temporarily) from menu
The bartender should immediately be notified when an item is running low
Modify/Recalculate price of product as compensation for mistake (when not on the house)
The Price modification has to be entered with a comment as to the reason.
Different fixed categories of reasons
Offer product on the house or at discount
Balancing the income/expenses
Update number in stock
Notify security of problem
accessible within 3 seconds
Get order for certain table
Change items on order
Allow for splitting the bill
Reserve table for group at specified time
Remove reservation
Print reservation note


BARTENDER:
Manage stock
Revise amounts
Order refill of items
Add/remove items from menu
Manage prices
Do accounting


GENERAL:
Create dictionary with 3 languages (NO hard-coded strings!!!)
English
Swedish
Chinese or Spanish?
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


TODO:
1. Create staff view
2. Transfor order detailed data from customer page to staff page.
3. implement undo-redo for adding items to cart


Tips:
1. You can use your first name and default password '123456' to log in as a VIP customer.
