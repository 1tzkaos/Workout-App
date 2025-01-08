// Views/AddExerciseView.swift
struct AddExerciseView: View {
    @Environment(\.dismiss) private var dismiss
    @EnvironmentObject private var store: ExerciseStore
    @State private var searchText = ""
    @State private var selectedExercises = Set<String>()
    
    let popularExercises = [
        "Bench Press", "Squat", "Deadlift", "Lat Pulldown",
        "Incline Dumbbell Press", "Leg Extension",
        "Incline Bench Press", "Pull-Up", "Dips",
        "Tricep Pushdown (Rope)", "Overhead Press",
        "Shoulder Press", "Leg Press", "Hammer Curls"
    ]
    
    var filteredExercises: [String] {
        if searchText.isEmpty {
            return popularExercises
        }
        return popularExercises.filter { $0.localizedCaseInsensitiveContains(searchText) }
    }
    
    var body: some View {
        NavigationView {
            List {
                Section(header: Text("By Popularity")) {
                    ForEach(filteredExercises, id: \.self) { exercise in
                        Button {
                            if selectedExercises.contains(exercise) {
                                selectedExercises.remove(exercise)
                            } else {
                                selectedExercises.insert(exercise)
                            }
                        } label: {
                            HStack {
                                Image(systemName: selectedExercises.contains(exercise) ? "checkmark.circle.fill" : "plus.circle")
                                    .foregroundColor(.green)
                                Text(exercise)
                            }
                        }
                    }
                }
            }
            .searchable(text: $searchText, prompt: "Search or enter exercise name")
            .navigationTitle("Add Exercises")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                Button("Done") {
                    store.addExercises(selectedExercises)
                    dismiss()
                }
            }
        }
    }
}