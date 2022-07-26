/**
 * Observer class that wraps the MutationObserver class, uses the observer pattern to subscribe to changes
 * Make sure to unsubscribe when finished using this class, else resources will not be recycled when going off from
 * a page where this JS is not used
 *
 * @constructor targetNode, classToWatch, classAddedCallback, classRemovedCallback, classToAdd
 * @param targetNode HTMLElement of which we want to listen to
 * @param classToWatch the class we are listening for
 * @param classAddedCallback callback which runs when the class is added, this is ran after the class has been added
 * @param classRemovedCallback callback which runs when the class is removed, this is ran after the class has been removed
 * @param classToAdd A class to add the target in the MutationRecords
 * @method subscribe Will listen for changes on the targetNode
 * @method subscribeToChildren Will listen for changes on the targetNode and its descendants, might be a bit slower depending on how down the tree it has to go
 * @method unsubscribe Will stop listening for changes
 */
 export default class ClassWatcher {
    private lassClassState: boolean;
    private observer: MutationObserver;
  
    constructor(
      private targetNode: HTMLElement,
      private classToWatch: string,
      private classAddedCallback: (el: HTMLElement, classToAddToWatch?: string, classToRemove?: string) => void,
      private classRemovedCallBack: (el: HTMLElement, classToAdd?: string) => void,
      private classToAddToWatch?: string,
      private classToRemove?: string
    ) {
      this.lassClassState = targetNode.classList.contains(this.classToWatch);
  
      this.observer = new MutationObserver(this.mutationCallback.bind(this));
    }
  
    subscribe() {
      this.observer?.observe(this.targetNode, { attributes: true });
    }
  
    subscribeToChildren() {
      this.observer?.observe(this.targetNode, { attributes: true, subtree: true, childList: true });
    }
  
    unsubscribe() {
      this.observer?.disconnect();
    }
  
    private mutationCallback(mutationList: MutationRecord[]) {
      console.log(mutationList);
  
      for (const mutation of mutationList) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const currentClassState = (mutation.target as HTMLElement).classList.contains(this.classToWatch);
  
          if (this.lassClassState !== currentClassState) {
            this.lassClassState = currentClassState;
  
            const target = mutation.target as HTMLElement;
  
            if (currentClassState) {
              this.classAddedCallback(target, this.classToAddToWatch, this.classToRemove);
            } else {
              this.classRemovedCallBack(target, this.classToRemove);
            }
          }
        }
      }
    }
  }
  