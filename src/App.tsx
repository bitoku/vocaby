import React, {useEffect, useState} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './tools/firebase';
import firestore from "./tools/firestore";
import {Button, FormControl, InputGroup} from "react-bootstrap";
import * as firebase from 'firebase/app';
import Word from "./data/word";

const App: React.FC = props => {
    const [headWord, setHeadWord] = useState('')
    const [tailWord, setTailWord] = useState('')
    const [user, setUser] = useState<firebase.User>();
    const [currentWord, setCurrentWord] = useState<Word>();

    useEffect(() => {
        firebase.auth().onAuthStateChanged((user: firebase.User | null) => {
            console.log(user);
            if (user) {
                setUser(user);
            } else {
                alert('logout');
            }
        })
        firebase.auth().signInAnonymously().catch((error) => {
            alert('something went wrong');
            console.log(error);
        })
    }, [])

    useEffect(() => {
        getNextWord();
    }, [])

    const postWord = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (headWord === "" || tailWord === "") {
            alert("なんか入力しなさい")
            return
        }
        Word.add(headWord, tailWord)
            .then((word) => {
                console.log('success')
                setHeadWord("")
                setTailWord("")
            })
            .catch(() => {
                console.log('error')
            })
    }

    const tryWord = () => {
        if (!currentWord) { return; }
        currentWord.try()
            .then(getNextWord)
            .catch(error => {
                alert("error");
                console.log(error);
            })
    }

    const getNextWord = () => {
        firestore.collection("words")
            .orderBy("trial")
            .limit(1)
            .get()
            .then((querySnapshot) => {
                if (querySnapshot.empty) { return; }
                const doc = querySnapshot.docs[0];
                const data = doc.data();
                setCurrentWord(new Word(data.head, data.tail, doc.id, data.trial, data.score))
            })
            .catch((error) => {
                alert("error");
                console.log(error)
            })
    }

    return (
        <div className="App">
            <header className="App-header">
                {currentWord && currentWord.head}
                <Button onClick={tryWord}>
                    Next
                </Button>
                <form onSubmit={postWord}>
                    <InputGroup>
                        <FormControl
                            onChange={(e: React.FormEvent<HTMLInputElement>) => {setHeadWord(e.currentTarget.value)}}
                            value={headWord}
                        />
                    </InputGroup>
                    <InputGroup>
                        <FormControl
                            onChange={(e: React.FormEvent<HTMLInputElement>) => {setTailWord(e.currentTarget.value)}}
                            value={tailWord}
                        />
                    </InputGroup>
                    <Button type='submit'>
                        登録
                    </Button>
                </form>
            </header>
        </div>
    );
}

export default App;
