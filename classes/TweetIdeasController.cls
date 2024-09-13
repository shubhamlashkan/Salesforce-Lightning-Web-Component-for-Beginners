public with sharing class TweetIdeasController {
	@AuraEnabled
    public static List<Tweet_Idea__c> getTweetIdeas(String category){
        try{
            List<Tweet_Idea__c> tweetIdeas = [Select id, category__c, Tweet_Text__c from Tweet_Idea__c where category__c=:category];
        
       	for(Tweet_Idea__c tweets: tweetIdeas){
            
            tweets.Tweet_Text__c = tweets.Tweet_Text__c.replaceAll('\\<p\\>','');
            
            tweets.Tweet_Text__c = tweets.Tweet_Text__c.replaceAll('\\</p\\>','');
            tweets.Tweet_text__c = tweets.Tweet_text__c.replaceAll('<span(.*?)>', '');
                tweets.tweet_text__c = tweets.tweet_text__c.replaceAll('</span>', '');
                tweets.tweet_text__c = tweets.tweet_text__c.replaceAll('\\<br\\>', '\n\n');
            tweets.Tweet_Text__c = tweets.Tweet_Text__c.unescapehtml4();
            
            system.debug(tweets.Tweet_Text__c);
        }
        return tweetIdeas;
        }
        catch(Exception ex){
            throw new AuraHandledException(ex.getMessage());
        }
    }
}