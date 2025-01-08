// Views/AddSetView.swift
struct AddSetView: View {
    let exerciseName: String
    @Environment(\.dismiss) private var dismiss
    @EnvironmentObject private var store: ExerciseStore
    @State private var reps = 2
    @State private var weight = 235.0
    @State private var activeInput: InputType = .weight
    
    enum InputType {
        case weight, reps
    }
    
    var body: some View {
        NavigationView {
            VStack(spacing: 20) {
                // Weight Input
                VStack(alignment: .leading) {
                    Text("WEIGHT")
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                    
                    HStack {
                        Button { weight -= 1 } label: {
                            Image(systemName: "minus.circle.fill")
                        }
                        
                        Spacer()
                        
                        Text("\(Int(weight)) lb")
                            .font(.title)
                        
                        Spacer()
                        
                        Button { weight += 1 } label: {
                            Image(systemName: "plus.circle.fill")
                        }
                    }
                    .padding()
                    .background(Color(.systemGray6))
                    .cornerRadius(10)
                }
                
                // Reps Input
                VStack(alignment: .leading) {
                    Text("REPS")
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                    
                    HStack {
                        Button { reps -= 1 } label: {
                            Image(systemName: "minus.circle.fill")
                        }
                        
                        Spacer()
                        
                        Text("\(reps) reps")
                            .font(.title)
                        
                        Spacer()
                        
                        Button { reps += 1 } label: {
                            Image(systemName: "plus.circle.fill")
                        }
                    }
                    .padding()
                    .background(Color(.systemGray6))
                    .cornerRadius(10)
                }
                
                Button {
                    store.addSet(exercise: exerciseName, reps: reps, weight: weight)
                    dismiss()
                } label: {
                    Text("Record Set")
                        .font(.headline)
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(Color.blue)
                        .foregroundColor(.white)
                        .cornerRadius(10)
                }
                
                // Number Pad
                LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 3), spacing: 20) {
                    ForEach(1...9, id: \.self) { number in
                        NumberButton(number: "\(number)", action: numberPressed)
                    }
                    NumberButton(number: ".", action: numberPressed)
                    NumberButton(number: "0", action: numberPressed)
                    NumberButton(number: "⌫", action: backspace)
                }
                
                Spacer()
            }
            .padding()
            .navigationTitle(exerciseName)
            .navigationBarTitleDisplayMode(.inline)
        }
    }
    
    private func numberPressed(_ number: String) {
        if activeInput == .weight {
            if number == "." {
                if !String(weight).contains(".") {
                    weight = weight + 0.0
                }
            } else {
                weight = (weight * 10) + (Double(number) ?? 0)
            }
        } else {
            if let num = Int(number) {
                reps = (reps * 10) + num
            }
        }
    }
    
    private func backspace() {
        if activeInput == .weight {
            weight = floor(weight / 10)
        } else {
            reps = reps / 10
        }
    }
}

struct NumberButton: View {
    let number: String
    let action: (String) -> Void
    
    var body: some View {
        Button {
            action(number)
        } label: {
            Text(number)
                .font(.title)
                .frame(maxWidth: .infinity)
                .padding()
                .background(Color(.systemGray6))
                .cornerRadius(10)
        }
    }
}