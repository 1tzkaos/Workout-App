// ViewModels/ExerciseStore.swift
class ExerciseStore: ObservableObject {
    @Published var exercises: [Exercise] = []
    @Published var workoutSets: [WorkoutSet] = []
    
    private let exercisesKey = "exercises"
    private let setsKey = "workout_sets"
    
    init() {
        loadExercises()
        loadWorkoutSets()
    }
    
    private func loadExercises() {
        if let data = UserDefaults.standard.data(forKey: exercisesKey),
           let decoded = try? JSONDecoder().decode([Exercise].self, from: data) {
            exercises = decoded
        } else {
            exercises = Exercise.sampleExercises
            saveExercises()
        }
    }
    
    private func loadWorkoutSets() {
        if let data = UserDefaults.standard.data(forKey: setsKey),
           let decoded = try? JSONDecoder().decode([WorkoutSet].self, from: data) {
            workoutSets = decoded
        }
    }
    
    func saveExercises() {
        if let encoded = try? JSONEncoder().encode(exercises) {
            UserDefaults.standard.set(encoded, forKey: exercisesKey)
        }
    }
    
    func saveWorkoutSets() {
        if let encoded = try? JSONEncoder().encode(workoutSets) {
            UserDefaults.standard.set(encoded, forKey: setsKey)
        }
    }
    
    func addExercises(_ names: Set<String>) {
        let newExercises = names.map { name in
            Exercise(id: UUID().uuidString, name: name)
        }
        exercises.append(contentsOf: newExercises)
        saveExercises()
    }
    
    func addSet(exercise: String, reps: Int, weight: Double) {
        let newSet = WorkoutSet(
            id: UUID().uuidString,
            exercise: exercise,
            reps: reps,
            weight: weight,
            date: Date()
        )
        workoutSets.append(newSet)
        saveWorkoutSets()
        
        // Update exercise lastUsed
        if let index = exercises.firstIndex(where: { $0.name == exercise }) {
            exercises[index].lastUsed = Date()
            saveExercises()
        }
    }
    
    func deleteSet(_ setId: String) {
        workoutSets.removeAll { $0.id == setId }
        saveWorkoutSets()
    }
}