import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

const PAGES = [
  {
    id: 1,
    lines: ["담소를", "나누어", "꽃을 피우다."],
  },
  {
    id: 2,
    lines: ["오늘 하루는", "어땠나요?", "마음의 소리를 들려주세요."],
  },
  {
    id: 3,
    lines: ["당신의 마음이", "머무는 곳에", "우리가 함께할게요."],
  },
];

export default function Onboarding() {
  const { width } = useWindowDimensions();
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const animatedTranslateY = useRef(new Animated.Value(40)).current;
  const animatedOpacity = useRef(new Animated.Value(0)).current;

  const startAnimation = () => {
    animatedTranslateY.setValue(40);
    animatedOpacity.setValue(0);

    Animated.parallel([
      Animated.timing(animatedTranslateY, {
        toValue: 0,
        duration: 900,
        useNativeDriver: true,
      }),
      Animated.timing(animatedOpacity, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleScroll = (event: any) => {
    const index = Math.round(
      event.nativeEvent.contentOffset.x / width
    );
    if (index !== currentIndex) {
      setCurrentIndex(index);

        startAnimation();
    }
  };

  const finishOnboarding = async () => {
    await AsyncStorage.setItem("onboardingDone", "true");
    router.replace("/");
  };

  return (
    <View style={styles.container}>
      {/* FlatList: 3페이지 */}
      <FlatList
        ref={flatListRef}
        data={PAGES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={[styles.page, { width }]}>
            <Animated.View
              style={{
                opacity: animatedOpacity,
                transform: [{ translateY: animatedTranslateY }],
              }}
            >
              {item.lines.map((line, idx) => (
                <Text
                  key={idx}
                  style={[
                    styles.text,
                    idx < item.lines.length - 1 ? styles.red : styles.black,
                  ]}
                >
                  {line}
                </Text>
              ))}
            </Animated.View>
          </View>
        )}
      />

      {/* dot indicator */}
      <View style={styles.dotsWrapper}>
        {PAGES.map((_, idx) => (
          <View
            key={idx}
            style={[
              styles.dot,
              currentIndex === idx && styles.dotActive,
            ]}
          />
        ))}
      </View>

      {/* 마지막 페이지에서만 버튼 표시 */}
      {currentIndex === PAGES.length - 1 && (
        <TouchableOpacity
          style={[styles.button, { width: width * 0.8 }]}
          onPress={finishOnboarding}
        >
          <Text style={styles.buttonText}>홈으로 가기</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  page: {
    justifyContent: "center",
    paddingHorizontal: 30,
  },

  text: {
    fontSize: 46,
    fontWeight: "700",
    marginBottom: 12,
    lineHeight: 60,
  },
  red: { color: "#8B0000" },
  black: { color: "#000" },

  dotsWrapper: {
    position: "absolute",
    bottom: 120,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
  },

  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#CFCFCF",
    marginHorizontal: 4,
  },

  dotActive: {
    backgroundColor: "#000",
    width: 7,
    height: 7,
  },

  button: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    backgroundColor: "#B36A3C",
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
