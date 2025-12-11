/**
 * Development helper component showing file path and edit instructions
 */

import { StyleSheet } from 'react-native';
import { ExternalLink } from './ExternalLink';
import { MonoText } from './StyledText';
import { Text, View } from './Themed';

interface Props {
    path: string;
}

export default function EditScreenInfo({ path }: Props) {
    return (
        <View>
            <View style={styles.container}>
                <Text style={styles.instructionText}>Open up the code for this screen:</Text>

                <View style={styles.codeContainer}>
                    <MonoText>{path}</MonoText>
                </View>

                <Text style={styles.instructionText}>
                    Change any text, save, and your app will automatically update.
                </Text>
            </View>

            <View style={styles.helpContainer}>
                <ExternalLink href="https://docs.expo.io/get-started/create-a-new-app/#opening-the-app-on-your-phonetablet">
                    <Text style={styles.helpLinkText}>Tap here if app doesn't update after changes</Text>
                </ExternalLink>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginHorizontal: 50,
    },
    codeContainer: {
        marginVertical: 7,
        borderRadius: 3,
        paddingHorizontal: 4,
        backgroundColor: 'rgba(0,0,0,0.05)',
    },
    instructionText: {
        fontSize: 17,
        lineHeight: 24,
        textAlign: 'center',
    },
    helpContainer: {
        marginTop: 15,
        marginHorizontal: 20,
        alignItems: 'center',
    },
    helpLinkText: {
        textAlign: 'center',
        paddingVertical: 15,
    },
});