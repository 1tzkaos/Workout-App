// Views/AnalyticsView.swift
import SwiftUI
import Charts
struct AnalyticsView: View {
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
                    Spacer()
                    StatView(title: "Average Weight", value: String(format: "%.1f", stats.average), unit: "lb")
                }
            }
            
            Section(header: Text("Weight Progress")) {
                Chart(exerciseSets.suffix(7)) { set in
                    LineMark(
                        x: .value("Date", set.date),
                        y: .value("Weight", set.weight)
                    )
                    .foregroundStyle(.blue)
                    
                    PointMark(
                        x: .value("Date", set.date),
                        y: .value("Weight", set.weight)
                    )
                    .foregroundStyle(.blue)
                }
                .frame(height: 200)
                .padding(.vertical)
            }
            
            Section(header: Text("Reps Progress")) {
                Chart(exerciseSets.suffix(7)) { set in
                    LineMark(
                        x: .value("Date", set.date),
                        y: .value("Reps", set.reps)
                    )
                    .foregroundStyle(.green)
                    
                    PointMark(
                        x: .value("Date", set.date),
                        y: .value("Reps", set.reps)
                    )
                    .foregroundStyle(.green)
                }
                .frame(height: 200)
                .padding(.vertical)
            }
        }
        .navigationTitle("\(exercise.name) Analytics")
    }
}

struct StatView: View {
    let title: String
    let value: String
    let unit: String
    
    var body: some View {
        VStack {
            Text(title)
                .font(.subheadline)
                .foregroundColor(.secondary)
            HStack(alignment: .firstTextBaseline, spacing: 4) {
                Text(value)
                    .font(.title2)
                    .fontWeight(.bold)
                Text(unit)
                    .font(.body)
                    .foregroundColor(.secondary)
            }
        }
        .frame(maxWidth: .infinity)
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(10)
    }
}