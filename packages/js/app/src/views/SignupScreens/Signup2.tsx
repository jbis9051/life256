import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import Header from '../../components/Header';
import TextInputBox from '../../components/TextInputBox';
import colors from '../../constants/Colors';
import Signup2Background from '../../../assets/SignUp2Background.svg';

type RootStackParamList = {
    Login: undefined;
    Signup1: undefined;
    Signup2: undefined;
    Splash: undefined;
};

type Props = createStackNavigator<RootStackParamList, 'Signup2'>;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: colors.white,
        width: '100%',
        height: '100%',
    },
    backgroundImage: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
    },
    titleContainer: {
        top: '7.5%',
        flex: 2,
        justifyContent: 'center',
    },
    signupContainer: {
        flex: 4,
        width: '80%',
        justifyContent: 'center',
    },
    signupButtonContainer: {
        flex: 2,
        width: '80%',
    },
    title: {
        fontSize: 45,
        fontWeight: '400',
        color: colors.primary,
    },
    signupButton: {
        height: 50,
        margin: 7,
        borderRadius: 25,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.primary,
    },
    buttonText: {
        color: colors.white,
        fontWeight: '600',
    },
});

const onSignUp = async () => null;

function Signup({ route, navigation }: Props) {
    return (
        <View style={styles.container}>
            <Signup2Background
                height={'100%'}
                width={'100%'}
                style={{ position: 'absolute' }}
            />
            <Header page={'Signup1'} />
            <View style={styles.titleContainer}>
                <Text style={styles.title}>Sign Up</Text>
            </View>
            <View style={styles.signupContainer}>
                <TextInputBox descriptor="Username" params={''} />
                <TextInputBox descriptor="Password" params={'password'} />
                <TextInputBox
                    descriptor="Confirm Password"
                    params={'password'}
                />
            </View>
            <View style={styles.signupButtonContainer}>
                <TouchableOpacity
                    style={styles.signupButton}
                    onPress={onSignUp()}
                >
                    <Text style={styles.buttonText}>Sign Up</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
export default Signup;
