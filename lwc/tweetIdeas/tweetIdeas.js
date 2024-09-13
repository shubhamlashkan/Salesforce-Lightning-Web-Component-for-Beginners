import { LightningElement,wire } from 'lwc';
import { getObjectInfo } from "lightning/uiObjectInfoApi";
import { getPicklistValues } from "lightning/uiObjectInfoApi";
import TWEETIDEAS_OBJECT from "@salesforce/schema/Tweet_Idea__c";
import CATEGORY_FIELD from "@salesforce/schema/Tweet_Idea__c.Category__c";
import fetchIdeas from "@salesforce/apex/TweetIdeasController.getTweetIdeas";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

export default class TweetIdeas extends LightningElement {

    categoryOptions =  [];  
    selectedItem;
    tweetIdeas;
    error;
    isShowModal = false;
  @wire(getObjectInfo, { objectApiName: TWEETIDEAS_OBJECT })
  objectInfo;

  @wire(getPicklistValues, { recordTypeId: "$objectInfo.data.defaultRecordTypeId", fieldApiName: CATEGORY_FIELD })
  categoryPicklist({data,error}){
    if(data){
        //console.log(data)
        this.categoryOptions = [...this.generatePicklistOptions(data)];
        this.selectedItem = this.categoryOptions[0];
        console.log('Category Options: ',this.categoryOptions);
    }
    if(error){
        console.log(error)
    }
  }

  generatePicklistOptions(data){
    let options =[];
    //console.log(data.values)
    for(var key in data.values){
        //console.log(data.values[key].label)
        options.push(data.values[key].label);
    }
    //console.log('options',options);
    return options;
  }
  
  fetchIdeasByCategory(event){
    const category = event.detail.name;
    console.log('Selected Category',category);
    fetchIdeas({category:category})
    .then(result=>{
        this.tweetIdeas = result;
        console.log( this.tweetIdeas);
    }).catch(error=>{
        this.error = error;
    })
  }

  handleSave(event){
    const tweetIdeaId = event.target.dataset.id;
    const tweetText = event.target.dataset.text;
    const savedText = localStorage.getItem(tweetIdeaId);
    if(savedText == tweetText){
      //console.log('Warning: Tweet idea is already saved')
      this.showToast('Already Saved','It looks like Tweet is already saved.','warning');
    }
    else{
      localStorage.setItem(tweetIdeaId,tweetText);
      this.showToast('Success','Tweet Saved Succesfully','success');
    }
    //console.log('Tweet Text: ',tweetText);
    
  }
  
  handleCopy(event){
    const tweetIdeaId = event.target.dataset.id;
    const tweetText = event.target.dataset.text;
    console.log('Tweet Text: ',tweetText);
    
    const textarea = document.createElement('textarea');
    textarea.value = tweetText;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    this.isShowModal = true;
  }

  handlePost(event){
    const tweetText = event.target.dataset.text;
    console.log('Tweet Text: ',tweetText);
    const url = 'https://twitter.com/intent/tweet?text='+tweetText;
    window.open(url,'_blank');
  }


  showToast(title, message,variant){
    const event = new ShowToastEvent({
      title:title,
      message:message,
      variant:variant
    });
    this.dispatchEvent(event)
  }


  handleCloseModal(){
    this.isShowModal = false;
  }
}