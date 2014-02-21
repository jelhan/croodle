croodle
=======
Croodle is a web application to schedule a date or to do a poll on a general topics. Stored content data like title and description, labels of options, names of users and there selection is encrypted/decrypted in the browser using 256 bits AES.

This is an alpha version. Changes could brake backward compatibility. Also it is not well tested, some features are missing and there is no user friendly design at this stage of development. It is not ment for productive use yet.

Croodle is inspired by ZeroBin: https://github.com/sebsauvage/ZeroBin and of course by Doodle.

Security notice
-------
As any other web application based end-to-end encryption Croodle could be attacked by an injection of maluse code on serverside or threw a man-in-the-middle attack. If an attacker could inject for example JavaScript, he would be able to read decrypted content in the browser and send it to a server under his controll.

Therefore you have to
* use an ecrypted connection to the server hosting Croodle. In most use cases this will be an httpS connection. We strongly recomend people hosting Croodle to force an encrypted connection to Croodle.
* trust the server.

You could check for an attack like this by using an development tool for your browser and check if unencrypted data of your poll is send over network or is stored in a cookie or the localStorage of your browser for later send.
