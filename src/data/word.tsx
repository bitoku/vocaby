import firestore from "../tools/firestore";

class Word {
    head: string;
    tail: string;
    docId: string;
    trial: number;
    score: number;
    constructor(head: string, tail: string, docId: string,
                trial: number = 0, score: number = 0) {
        this.head = head;
        this.tail = tail;
        this.docId = docId;
        this.trial = trial;
        this.score = score;
    }

    static add = (head: string, tail: string) => {
        return firestore.collection("words").add({
            head: head,
            tail: tail,
            trial: 0,
            score: 0,
        }).then((docRef) => {
            return new Word(head, tail, docRef.id);
        })
    }

    try = () => {
        return firestore.collection("words").doc(this.docId)
            .update({
                trial: this.trial + 1
            })
            .then(() => {
                return new Word(this.head, this.tail, this.docId, this.trial+1);
            })
    }
}

export default Word;