import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

import {
  DashboardTab,
  DashboardTabBar,
} from "./dashboard-tab-bar";

type DashboardScreenProps = {
  activeTab: DashboardTab;
  children: ReactNode;
  backgroundColor?: string;
};

export function DashboardScreen({
  activeTab,
  children,
  backgroundColor = "#FFFFFF",
}: DashboardScreenProps) {
  return (
    <View style={[styles.screen, { backgroundColor }]}>
      {children}
      <View style={styles.tabBarWrap}>
        <DashboardTabBar activeTab={activeTab} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  tabBarWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
});
