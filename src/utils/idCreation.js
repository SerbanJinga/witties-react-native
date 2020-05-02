import firebase from 'firebase';
import React, {Component} from 'react';
import Login from "../screens/login/SignUp"
import { database } from '../../App';
import SignUp from '../screens/login/SignUp';



export default class idCreation extends Component{
    constructor(props) {
        super(props)
        this.state = {
            documentData:[]
        };
    }

    f

    obtainDiscriminator = (name) => {

        var transmitDiscriminant = {
            val:""
        }

        async function f() {
            try {
                console.log("Am ajuns pana aici");
                let initialQuery = await database.collection("useri").where("displayName", "==", name).orderBy("discriminator", "asc")

                let documentSnapshots = await initialQuery.get();
                let documentData = documentSnapshots.docs.map(document => document.data());


                function pad(num) {
                    var s = "000000000" + num;
                    return s.substr(s.length - 4);
                }


               let dis = documentData[documentData.length - 1].discriminator;
                transmitDiscriminant.val = pad(dis); 




                console.log("Updated cu 4 cifre", dis);

            } catch (error) {
                console.log(error);
            }
        }
        f().then(() => {
            const l = new SignUp;
            console.log("ianite de return valoare este ", transmitDiscriminant.val);//pana aici valoare este buna
            l.recievedDiscrim(transmitDiscriminant.val,name);
        })
    }





}