// Views/HomeView.swift
struct HomeView: View {
    @EnvironmentObject private var store: ExerciseStore
    @State private var showingAddExercise = false
    
    var body: some View {
        List {
            Section {
                VStack(alignment: .leading, spacing: 8) {
                    Text("Quickly Log a Set")
                        .font(.headline)
                    Text("Swipe right on an exercise to record.")
                        .foregroundColor(.secondary)
                }
                .listRowBackground(Color(.systemGray6))
                .padding(.vertical, 8)
            }
            
            ForEach(store.exercises) { exercise in
                NavigationLink(destination: ExerciseDetailView(exercise: exercise)) {
                    HStack {
                        Text(exercise.name)
                            .font(.body)
                        Spacer()
                        if let lastUsed = exercise.lastUsed {
                            Text(formatLastUsed(lastUsed))
                                .foregroundColor(.blue)
                        }
                    }
                }
            }
        }
        .navigationTitle("Exercises")
        .toolbar {
            Button("Add Exercises") {
                showingAddExercise = true
            }
        }
        .sheet(isPresented: $showingAddExercise) {
            AddExerciseView()
        }
    }
    
    private func formatLastUsed(_ date: Date) -> String {
        let days = Calendar.current.dateComponents([.day], from: date, to: Date()).day ?? 0
        
        if days == 0 { return "Today" }
        if days == 1 { return "Yesterday" }
        if days < 7 { return "\(days)d ago" }
        if days < 30 { return "\(days / 7)w ago" }
        return "\(days / 30)m ago"
    }
}