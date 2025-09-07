import numpy as np
import mpmath as mp
import scipy.optimize as opt

def equation(r, z):
    return (5*125*z**3 - 3*125*z*r**2) * np.exp(-5 * r/2) - 1

z_first = 0.185236208518
z_last = 3.815456860802
# Generate 50 evenly spaced values for z
z_values = np.linspace(z_first, z_last, 50)
z_values = z_values[1:-1]
pairs = []
str_pairs = ''

for z in z_values:
    # Use a numerical solver to find x
    try:
        # Initial guess for x
        r_initial_guess = z
        r_solution = opt.fsolve(equation, r_initial_guess, args=(z,))
        x_solution = np.sqrt(r_solution**2 - z**2)
        pairs.append((round(z, 4), round(x_solution[0], 4)))
        str_pairs = str_pairs + "[" + str(round(x_solution[0], 4)) + "," + str(round(z, 4)) + "],"
    except Exception as e:
        print("Failed to solve")

str_pairs = "[0," + str(round(z_first, 4)) + "]," + str_pairs + "[0," + str(round(z_last, 4)) + "]"

print(str_pairs)
# Print the pairs
# for pair in pairs:
#     print(pair)