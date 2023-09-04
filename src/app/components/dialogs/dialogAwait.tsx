import React, { useState } from "react";
import { Modal, View, Text, ActivityIndicator } from "react-native";
const DialogAwait = ({
    isShow
}: { isShow?: boolean }) => {
    return (
        <View>
            <Modal
                animationType="fade"
                transparent={true}
                visible={isShow}
            >
                <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <View style={{ justifyContent: "center", alignItems: 'center' }}>
                        <ActivityIndicator size="large" color="#988050" />
                    </View>
                </View>
            </Modal>
        </View>
    );
}
export default DialogAwait;