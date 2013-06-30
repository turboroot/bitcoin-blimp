console.log("loaded");

var pollInterval = 1; // 1 minute
var bitfunderUrl = 'https://bitfunder.com/market';
var activeStock = 'G.ASICMINER-PT';

chrome.alarms.create({
  periodInMinutes: pollInterval,
  when: Date.now()+250
});

chrome.alarms.onAlarm.addListener(function() {
  $.ajax({
    url: bitfunderUrl,
    success: function(data) {
      // prevent jquery from loading images
      // http://stackoverflow.com/questions/15113910/jquery-parse-html-without-loading-images
      data = data.replace(/<img[^>]*>/g,"");

      // Return a subset of the columns in the row with asset_id=G.ASICMINER-PT
      // 2 td per price; both are similar with the exception of ฿ added to the former
      var prices = $('tr[asset_id="' + activeStock + '"] td', $(data)).slice(2, 8);
      
      // working it as a typical array brings pains
      var lastPrice = prices.eq(1).text();
      var askPrice = prices.eq(3).text();
      var bidPrice = prices.eq(5).text();

      chrome.browserAction.setBadgeText({
        text: lastPrice.substring(0, 4)
      });

      var frameCount = 0;

      // Flashes badge when the price is updated
      var flashBadge = setInterval(function() {
        if (frameCount > 2) {
          clearInterval(flashBadge);
        }

        chrome.browserAction.setBadgeBackgroundColor({
          color: (frameCount % 2 == 0) ? [64, 255, 64, 255] : [255, 0, 0, 255]
        });

        frameCount++;
      }, 100);
    },
    error: function() {
      // TODO: more elegant error handling
      console.log('err');
    }
  });
});