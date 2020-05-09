import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export default habarnam  = () => {

 functions.firestore
  .document('locations/{locationID}').onWrite((change, context) => {

    const newLocation = change.after.data()
    const locationId = change.after.id
    const TARGET_COLLECTION = 'hosts'

    if (newLocation) {

      const oldLocation = change.before.data()
      const db = admin.firestore()

      const updatedLocations = admin.firestore.FieldValue.arrayUnion({
        id: locationId,
        name: newLocation.name,
        description: newLocation.description,
      })

      if (oldLocation) {

        db.collection(TARGET_COLLECTION).doc(newLocation.hostId).update({
          locations: admin.firestore.FieldValue.arrayRemove({
            id: locationId,
            name: oldLocation.name,
            description: oldLocation.description
          })
        }).then(() => {
          console.log('Removed old element from Host -> locations array successfully');
          db.collection(TARGET_COLLECTION).doc(newLocation.hostId).update({
            locations: updatedLocations
          }).then(() => {
            console.log('Added new element to the Host -> locations array successfully');
          }).catch(error => {
            console.log(error);
          })
        })
          .catch(error => {
            console.log(error);
          })
      } else {
        db.collection(TARGET_COLLECTION).doc(newLocation.hostId).update({
          locations: updatedLocations
        }).then(() => {
          console.log('Added new element to the empty Host -> locations array successfully');
        }).catch(error => {
          console.log(error);
        })
      }
    }
  });
}
