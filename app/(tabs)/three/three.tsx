/**
 * Night graph tab screen showing detailed sleep pattern
 */

import { StyleSheet } from 'react-native';
import { View } from '@/components/Themed';
import NightGraph from '@/components/NightGraph';
import { nightGraphData, nightGraphEvents } from '@/constants/Data';
import BodyActionLink from "@/components/BodyActionLink";
import React from "react";
import IconTextRow from "@/components/IconTextRow";
import Colors from "@/constants/Colors";
import HeaderText from "@/components/HeaderText";

export default function TabThreeScreen() {
    return (
        <View style={styles.screenContainer}>
            <HeaderText text={"Night graph"} />
            {/* This wrapper centers everything as a block */}
            <View style={styles.centeredBlock}>
                <View style={styles.editTagsWrapper}>
                    <BodyActionLink
                        href="/modal_change_hour"
                        label="Edit tags"
                        iconName="edit"
                        position="right"
                    />
                </View>

                <NightGraph
                    data={nightGraphData}
                    events={nightGraphEvents}
                />

                <View style={styles.labelContainer}>
                    <IconTextRow
                        iconName="bed"
                        text="Hours of sleep"
                        color={Colors.asleepColor}
                    />
                    <IconTextRow
                        iconName="eye"
                        text="Time awake"
                        color={Colors.awakeColor}
                    />
                    <IconTextRow
                        iconName="mobile"
                        text="Night pickups"
                        color={Colors.pickupColor}
                    />
                </View>

                <View style={styles.buttonRow}>
                    <View style={styles.buttonContainer}>
                        <BodyActionLink
                            href="/three/monthly_graph"
                            label="Monthly history"
                            iconName="calendar"
                            position="left"
                        />
                    </View>
                    <View style={styles.buttonContainer}>
                        <BodyActionLink
                            href="/modal_change_hour"
                            label="Export image"
                            iconName="image"
                            position="right"
                        />
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
    },
    centeredBlock: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        paddingVertical: 20,
    },
    editTagsWrapper: {
        width: '100%',
        marginBottom: 15,
    },
    labelContainer: {
        paddingHorizontal: 15,
        marginBottom: 10,
        alignItems: 'center',
        width: '100%',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        width: '100%',
    },
    buttonContainer: {
        flex: 1,
    },
});