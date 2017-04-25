import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableHighlight,
    AsyncStorage,
    InteractionManager,
} from 'react-native';
import NavigationBar from 'react-native-navbar';
import List from '../components/List';
import Contacts from 'react-native-contacts';
const DELETE_CONFIRMATION = 'DELETE_CONFIRMATION';

export default class DeleteContacts extends Component {
    state = {
        renderPlaceholderOnly: true,
    }

    componentDidMount() {
        console.log('InteractionManager', InteractionManager)
        InteractionManager.runAfterInteractions(() =>
            this.setState({ renderPlaceholderOnly: false })
        );
    }

    render() {
        console.log(this.props);
        return (
            <View style={styles.container}>
                <NavigationBar
                    style={{
                        borderBottomWidth: 1,
                        borderBottomColor: '#ccc'
                    }}
                    leftButton={{
                        title: 'Back',
                        handler: () => this.props.navigator.pop()
                    }}
                />
                <Button
                    numberOfContacts={this.props.contactsToDelete.length}
                    onPress={() => {
                        deleteContacts(this.props.contactsToDelete)

                        this.props.navigator.push({
                            name: DELETE_CONFIRMATION,
                            passProps: {
                                numContactsDeleted: this.props.contactsToDelete.length
                            }
                        })
                    }}
                />

                            <List
                                data={this.props.contactsToDelete}
                                removeContactToBeDelete={this.props.removeContactToBeDelete}
                            />


            </View>
        )
    }
}

function deleteContacts(contacts) {
    console.log("contacts", contacts);
    AsyncStorage.multiSet([
        ['contactsToDeleteArray', JSON.stringify([])]
    ]).then(res => {
        contacts.forEach(contact => {
            console.log("contact", contact);

            Contacts.deleteContact(
                { recordID: contact.recordID },
                err => console.log(err)
            )

        })
    });
}

function Button(props) {
    const text = props.numberOfContacts === 1 ? 'Contact' : 'Contacts';
    return (
        <TouchableHighlight
            style={styles.buttonWrapper}
            onPress={props.onPress}
        >
            <Text style={styles.buttonText}>{`Delete ${props.numberOfContacts} ${text}`}</Text>
        </TouchableHighlight>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderWidth: 2,
        borderColor: 'orange',
        backgroundColor: '#fff',
    },
    buttonWrapper: {
        backgroundColor: 'red',
        borderWidth: 1,
        borderColor: 'red',
        height: 40,
        borderRadius: 5,
        marginVertical: 20,
        marginHorizontal: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
})

