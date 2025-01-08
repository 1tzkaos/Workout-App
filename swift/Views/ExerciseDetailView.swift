// Views/ExerciseDetailView.swift
struct ExerciseDetailView: View {
    let exercise: Exercise
    @EnvironmentObject private var store: ExerciseStore
    @State private var showingAddSet = false
    
    var exerciseSets: [WorkoutSet] {
        store.workoutSets
            .filter { $0.exercise == exercise.name }
            .sorted { $0.date > $1.date }
    }
    
    var body: some View {
        List {
            Section {
                NavigationLink("Analytics") {
                    AnalyticsView(exercise: exercise)
                }
                
                HStack {
                    Text("1RM")
                    Spacer()
                    Text("Off")
                        .foregroundColor(.secondary)
                }
            }
            
            if let lastUsed = exercise.lastUsed {
                Section {
                    Text("Last used: \(formatLastUsed(lastUsed))")
                        .foregroundColor(.secondary)
                }
            }
            
            ForEach(exerciseSets) { set in
                HStack {
                    Text(set.date, style: .time)
                    Spacer()
                    Text("\(set.reps) reps")
                        .foregroundColor(.green)
                    Text("\(Int(set.weight)) lb")
                        .foregroundColor(.orange)
                }
                .swipeActions(edge: .trailing) {
                    Button(role: .destructive) {
                        store.deleteSet(set.id)
                    } label: {
                        Label("Delete", systemImage: "trash")
                    }
                }
            }
        }
        .navigationTitle(exercise.name)
        .toolbar {
            Button {
                showingAddSet = true
            } label: {
                Image(systemName: "plus.circle.fill")
                    .font(.title2)
            }
        }
        .sheet(isPresented: $showingAddSet) {
            AddSetView(exerciseName: exercise.name)
        }
    }
}