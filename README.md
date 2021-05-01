------------------------------- Backstory -------------------------------

This was a school assignment project where we had to code a GUI to a RaspBerry Pi 4 that could be used with the RaspBerry Pi provided 7'' touchscreen. In addition, we had to design and develop a website that has a connection to a MongoDB database (we decided to use Atlas), an implementation of Socket.IO, route validation (all pages but login are usable only by logged in users) and authentication.

Our team's idea was to develop a cocktail-like GUI into the RaspBerry Pi 4, which the potential customers could then use with the touchscreen to make different cocktail transactions. We designed our logo so that it would make us look like we are experts in making cocktails and that drink concoctions are our specialization. GUI was to be developed by using Tkinter and Python.

This was the reason why we made the current pages (dashboard/products/earnings/signout) into our website. You can see all of the most important stuff in the dashboard view (latest transactions and the current supply). In the products view you can add an entirely new cocktail or you can remove/modify the current ones. The earnings view gives you the sum of all the transactions done (you can see the profits), latest transactions with the corresponding price tag and it also shows you the top 3 most bought cocktails. Lastly, the sign out in the navigation bar will simply just sign you out and remove that session's cookies from your browser.

We still had time left before the deadline so we decided to add the NFC shield implementation into the cocktail GUI. Before just about anyone could have made a transaction but now the cocktail application requires you to show the correct key tag and place it on top of the RFID reader(keytags can be added). We used the RaspBerry Pi's GPIO banks and python (among other libraries) to make this work.

This current coronavirus pandemic was the reason why we didn't use real liquids, which is why we decided to simulate the pouring of the cocktails with a simple led simulation (red, green and blue). You can modify this led simulation from the website's products view. The blinking was done with real leds and we used the GPIO banks and python to make them blink if a customer ordered a drink. Blinking is done while in the "Estimated waiting time..." screen.