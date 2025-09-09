import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Button, Surface, Text } from "react-native-paper";
import { useAuth } from "@/lib/auth-context";
import client, {
  DATABASE_ID,
  HABITS_COLLECTION_ID,
  RealtimeResponse,
  databases,
} from "@/lib/appwrite";
import { Query } from "react-native-appwrite";
import { Habit } from "@/types/database.type";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ScrollView } from "react-native";
import { Swipeable } from "react-native-gesture-handler";

const index = () => {
  const { signOut, user } = useAuth();
  const [habits, setHabits] = useState<Habit[]>();
  const swipeableRefs = useRef<{ [key: string]: Swipeable | null }>({});

  useEffect(() => {
    if (user) {
      const channel = `databases.${DATABASE_ID}.collections.${HABITS_COLLECTION_ID}.documents`;
      const habitSubscription = client.subscribe(
        channel,
        (response: RealtimeResponse) => {
          if (
            response.events.includes(
              "databases.*.collections.*.documents.*.create"
            )
          ) {
            fetchHabits();
          } else if (
            response.events.includes(
              "databses.*.collections.*.documents.*.update"
            )
          ) {
            fetchHabits();
          } else if (
            response.events.includes(
              "databases.*.collections.*.documents.*.delete"
            )
          ) {
            fetchHabits();
          }
        }
      );

      fetchHabits();
      return () => {
        habitSubscription();
      };
    }
  }, [user]);

  const fetchHabits = async () => {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        HABITS_COLLECTION_ID,
        [Query.equal("user_id", user?.$id ?? "")]
      );
      console.log(response.documents);
      setHabits(response.documents as Habit[]);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.title}>
          Today Habits
        </Text>
        <Button mode="text" onPress={signOut} icon={"logout"}>
          Sign out{" "}
        </Button>
      </View>
      <ScrollView showsHorizontalScrollIndicator={false}>
        {habits?.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              {" "}
              No habits yet. Add your first Habit
            </Text>
          </View>
        ) : (
          habits?.map((habit, key) => (
            <Swipeable
              ref={(ref) => {
                swipeableRefs.current[habit.$id] = ref;
              }}
              key={key}
            >
              <Surface style={styles.card} elevation={0}>
                <View key={key} style={styles.cardContent}>
                  <Text style={styles.cardTitle}> {habit.title}</Text>
                  <Text style={styles.cardDescription}>
                    {" "}
                    {habit.description}
                  </Text>
                  <View style={styles.cardFooter}>
                    <View style={styles.streakBadge}>
                      <MaterialCommunityIcons
                        name="fire"
                        size={18}
                        color={"#ff9800"}
                      />
                      <Text style={styles.streakText}>
                        {habit.streak_count} day streak
                      </Text>
                    </View>
                    <View>
                      <View style={styles.frequencyBadge}>
                        <Text>
                          {habit.frequency.charAt(0).toUpperCase() +
                            habit.frequency.slice(1)}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </Surface>
            </Swipeable>
          ))
        )}
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontWeight: "bold",
  },
  card: {
    marginBottom: 18,
    borderRadius: 8,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  cardContent: {
    padding: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#22223b",
  },
  cardDescription: {
    fontSize: 15,
    marginBottom: 16,
    color: "#6c6c80",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff3e0",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  streakText: {
    marginLeft: 4,
    color: "#ff9800",
    fontWeight: "600",
  },
  frequencyBadge: {
    backgroundColor: "#e0f7fa",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#999999",
  },
});

export default index;
