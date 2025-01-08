// FitnessApp.swift
import SwiftUI

@main
struct FitnessApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}

// Models/Exercise.swift
struct Exercise: Identifiable, Codable {
    let id: String
    let name: String
    var lastUsed: Date?
    
    static let sampleExercises = [
        Exercise(id: "1", name: "Bench Press"),
        Exercise(id: "2", name: "Squat"),
        Exercise(id: "3", name: "Leg Press"),
        Exercise(id: "4", name: "Hammer Curls")
    ]
}

struct WorkoutSet: Identifiable, Codable {
    let id: String
    let exercise: String
    let reps: Int
    let weight: Double
    let date: Date
}














    let exercise: Exercise
    @EnvironmentObject private var store: ExerciseStore
    
    var exerciseSets: [WorkoutSet] {
        store.workoutSets
            .filter { $0.exercise == exercise.name }
            .sorted { $0.date < $1.date }
    }
    
    var stats: (max: Double, average: Double) {
        let weights = exerciseSets.map { $0.weight }
        return (
            max: weights.max() ?? 0,
            average: weights.reduce(0, +) / Double(weights.count)
        )
    }
    
    var body: some View {
        List {
            Section {
                HStack {
                    StatView(title: "Max Weight", value: "\(Int(stats.max))", unit: "lb")
                    StatView