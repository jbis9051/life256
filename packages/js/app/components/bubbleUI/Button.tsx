import React, { useContext, useEffect, useRef } from 'react';
import {
    TouchableOpacity,
    Text,
    StyleProp,
    Platform,
    ViewStyle,
    View,
    ActivityIndicator,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import Colors from '../../constants/Colors';

const isAndroid = Platform.OS === 'android';

type ColorTypes = 'primary' | 'secondary' | 'danger';

function FilledButton(props: StyledButtonProps) {
    const { color, children, style, onPress, loading, disabled, fontSize } =
        props;

    const bgcolor = disabled ? 'rgba(0,0,0,.06)' : Colors.colors[color];

    return (
        <TouchableOpacity
            style={[
                {
                    height: 40,
                    backgroundColor: bgcolor,
                    borderRadius: 15,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                },
                style,
            ]}
            onPress={onPress}
        >
            {(() => {
                if (loading)
                    return (
                        <ActivityIndicator style={{ marginHorizontal: 15 }} />
                    );
                return (
                    <Text
                        style={{
                            color: disabled
                                ? Colors.colors.secondaryPaper
                                : Colors.complementColors[color],
                            fontSize,
                        }}
                    >
                        {children}
                    </Text>
                );
            })()}
        </TouchableOpacity>
    );
}

function OutlinedButton(props: StyledButtonProps) {
    const { color, children, style, onPress, loading, disabled, fontSize } =
        props;

    const forecolor = disabled ? 'rgba(0,0,0,.06)' : Colors.colors[color];
    return (
        <TouchableOpacity
            style={[
                {
                    height: 40,
                    backgroundColor: Colors.background,
                    borderStyle: 'solid',
                    borderWidth: 1,
                    borderRadius: 15,
                    borderColor: forecolor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                },
                style,
            ]}
            onPress={onPress}
        >
            {(() => {
                if (loading)
                    return (
                        <ActivityIndicator style={{ marginHorizontal: 15 }} />
                    );
                return (
                    <Text
                        style={{
                            color: forecolor,
                            fontSize,
                        }}
                    >
                        {children}
                    </Text>
                );
            })()}
        </TouchableOpacity>
    );
}

interface StyledButtonProps {
    color: ColorTypes;
    variant?: 'filled' | 'outlined';
    children: React.ReactText;
    style?: StyleProp<ViewStyle>;
    onPress?: () => void;
    loading?: boolean;
    disabled?: boolean;
    fontSize?: number;
}
export default function StyledButton(props: StyledButtonProps) {
    const { variant, loading } = props;
    const firstUpdate = useRef(true);

    useEffect(() => {
        if (firstUpdate.current) {
            firstUpdate.current = false;
            return;
        }
        if (loading) {
            Haptics.selectionAsync();
        }
    }, [loading]);

    const onPressHaptic = () => {
        Haptics.selectionAsync();
        props.onPress && props.onPress();
    };

    switch (variant) {
        case 'outlined':
            return <OutlinedButton {...props} onPress={onPressHaptic} />;
        case 'filled':
        default:
            return <FilledButton {...props} onPress={onPressHaptic} />;
    }
}

interface TextButtonProps {
    children: React.ReactText;
    color?: ColorTypes;
    onPress?: () => void;
    style?: StyleProp<ViewStyle>;
    disabled?: boolean;
    nomargin?: boolean;
    fontSize?: number;
    inHeader?: boolean;
    underlined?: boolean;
}
export function TextButton(props: TextButtonProps) {
    const {
        children,
        onPress,
        color,
        style,
        disabled,
        nomargin,
        fontSize,
        inHeader,
        underlined,
    } = props;

    let noMarginStyle: typeof style = {};
    if (nomargin || inHeader) {
        noMarginStyle = {
            margin: 0,
            marginTop: 0,
            marginBottom: 0,
            marginLeft: 0,
            marginRight: 0,
        };
    }
    let _fontSize = 20;
    if (inHeader) {
        _fontSize = 16;
    } else if (fontSize) {
        _fontSize = fontSize;
    }

    return (
        <>
            <TouchableOpacity
                disabled={disabled}
                onPress={onPress || (() => {})}
                style={[
                    { margin: 15, marginTop: isAndroid ? 15 : 20 },
                    noMarginStyle,
                    style,
                ]}
            >
                <Text
                    style={{
                        fontSize: _fontSize,
                        color: color === 'secondary' ? 'black' : '#007AFF',
                        textDecorationLine: underlined
                            ? 'underline'
                            : undefined,
                    }}
                >
                    {children}
                </Text>
            </TouchableOpacity>
        </>
    );
}
