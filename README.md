# 24SevenOya
npm install vue vue-loader vue-template-compiler webpack webpack-cli webpack-dev-server babel-loader @babel/core @babel/preset-env css-loader vue-style-loader html-webpack-plugin rimraf -D



TODO:
*****
    * BUG: Calls that wait long show up multiple times 
<!-- >>>> TEST -->

<!-- further testing and fixing on this -->
    * ADD WHO TOOK THE CALL TO CALL LOG 


    * Save logs --> Firebase
<!-- 1 possibility is to work with a bot that is always logged in, can we get that from Oyatel? -->
<!-- Other way is to check if a call is already in the system, but needs extra logic 
        We then need to assume everyone's time is synced and check same'ish time and number/name 
        the sum of everyone's logged calls should also pretty much be a full day -->


Long term:
**********
    * Select only the modules you want to see
    * Total calling time per agent
    * DB with emails
    * Service worker for desktop notifications
    * DB with numbers and total calling time
    * hitta.se -> too expensive, free alternative?