// app/voice/talk.tsx
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function VoiceTalkScreen() {
  const router = useRouter();

  // listening: 질문 읽어주는 상태
  // speaking: 사용자가 말하는 상태
  const [mode, setMode] = useState<"listening" | "speaking">("listening");

  const questionText =
    "오늘 점심\n잘 챙겨\n드셨어요?\n뭐 드셨어요?";

  const speakingText =
    "편하게 말씀해 주세요.\n다마가 잘 듣고 있어요.";

  const handleMicPress = () => {
    // 모드 토글
    setMode((prev) => (prev === "listening" ? "speaking" : "listening"));
  };

  const isListening = mode === "listening";

  return (
    <SafeAreaView style={styles.container}>
      {/* 상단 헤더 */}
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>음성대화</Text>
        <TouchableOpacity onPress={() => router.replace("/(tabs)")}>
          <Ionicons name="home-outline" size={22} color="#222" />
        </TouchableOpacity>
      </View>

      {/* 상태 박스 */}
      <View style={styles.stateWrapper}>
        <View style={styles.stateBox}>
          <Text style={styles.stateText}>
            {isListening ? "듣는중" : "말씀 중이에요"}
          </Text>
        </View>
      </View>

      {/* 중앙 텍스트 (질문 / 안내문) */}
      <View style={styles.questionWrapper}>
        {(isListening ? questionText : speakingText)
          .split("\n")
          .map((line, idx) => (
            <Text key={idx} style={styles.questionText}>
              {line}
            </Text>
          ))}
      </View>

      {/* 마이크 버튼 */}
      <View style={styles.micWrapper}>
        <TouchableOpacity
          style={styles.micButton}
          onPress={handleMicPress}
          activeOpacity={0.8}
        >
          <Ionicons
            name={isListening ? "mic" : "mic-outline"}
            size={30}
            color="#fff"
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const MAIN_COLOR = "#BF6A2A";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingHorizontal: 32,
    paddingTop: 24,
  },
  headerRow: {
    marginTop: 4,
    paddingHorizontal: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 14,
    color: "#555",
  },
  stateWrapper: {
    marginTop: 24,
    alignItems: "center",
  },
  stateBox: {
    paddingHorizontal: 64,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#EDEDED",
  },
  stateText: {
    fontSize: 16,
    color: "#333",
  },
  questionWrapper: {
    flex: 1,
    justifyContent: "center",
  },
  questionText: {
    fontSize: 26,
    lineHeight: 34,
    fontWeight: "500",
    color: "#111",
  },
  micWrapper: {
    alignItems: "center",
    marginBottom: 56,
  },
  micButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: MAIN_COLOR,
    alignItems: "center",
    justifyContent: "center",
  },
});
