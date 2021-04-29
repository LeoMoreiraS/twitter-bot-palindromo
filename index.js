const Twit = require("twit");
require("dotenv").config()

function reverseString(str) {
    // Step 1. Use the split() method to return a new array
    var splitString = str.split(""); // var splitString = "hello".split("");
    // ["h", "e", "l", "l", "o"]
 
    // Step 2. Use the reverse() method to reverse the new created array
    var reverseArray = splitString.reverse(); // var reverseArray = ["h", "e", "l", "l", "o"].reverse();
    // ["o", "l", "l", "e", "h"]
 
    // Step 3. Use the join() method to join all elements of the array into a string
    var joinArray = reverseArray.join(""); // var joinArray = ["o", "l", "l", "e", "h"].join("");
    // "olleh"
    
    //Step 4. Return the reversed string
    return joinArray; // "olleh"
}

const bot = new Twit({
    consumer_key: process.env.API_KEY,
    consumer_secret: process.env.API_SECRET_KEY,
    access_token: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
    timeout_ms: 60*1000,
});

function BotInit(){
    var query ={
        q:`from:${process.env.USER}`,
    };

    bot.get("search/tweets",query,(err,data,res)=>{
        if(err){
            console.error(err);
        }else{
            data.statuses.forEach(tweet=>{
                
                const userName =tweet.user.screen_name;
                const tweetId = tweet.id_str;
                const text = tweet.text;
                if(tweet.in_reply_to_status_id==null&&parseInt(tweet.favorite_count)<10){
                    console.log(tweet)
                    if(tweet.truncated){
                        const text2 = tweet.text.split(/\shttp?s/)[0];
                        bot.post('statuses/update', { in_reply_to_status_id: tweetId, status: `@${userName} ${reverseString(text2)}` }, (err, data, response) => {
                            if(err){
                                console.error(err)
                            }else{
                                    console.log("bot respondeu",+"@"+userName+text2);
                            }
                        })
                    }else{
                    bot.post('statuses/update', { in_reply_to_status_id: tweetId, status: `@${userName} ${reverseString(text)}` }, (err, data, response) => {
                        if(err){
                            console.error(err)
                        }else{
                                console.log("bot respondeu",+"@"+userName+text);
                        }
                   })
                }
            }
           })
                            
        }
        
    })  
}
setInterval(BotInit,120000);
BotInit()