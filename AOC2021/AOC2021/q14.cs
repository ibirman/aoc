using System.IO;
using System.Runtime.Intrinsics.X86;
using System.Text;
using System.Collections.Generic;
using System;
using System.Linq;
namespace AdventOfCode2021
{
    public class Day14 : Problem
    {
        string polymerTemplate;
        Dictionary<string, char> rules = new Dictionary<string, char>();
        Dictionary<string, long> pairCounts = new Dictionary<string, long>();

        public Day14(string inputPath) : base(inputPath)
        {
            polymerTemplate = puzzleInput[0];
            foreach (string rule in puzzleInput.Where(x => x.Contains("->")))
            {
                string[] parts = rule.Split("->");
                rules[parts[0].Trim()] = parts[1].Trim().First();
            }

            for (int i = 1; i < polymerTemplate.Length; i++)
            {
                string pair = "" + polymerTemplate[i - 1] + polymerTemplate[i];
                pairCounts[pair] = pairCounts.ContainsKey(pair) ? pairCounts[pair] + 1 : 1;
            }
        }

        // The brute force approach
        public override void Part1()
        {
            string state = polymerTemplate;
            for (int i = 0; i < 10; i++)
            {
                state = NaieveStep(state);
            }
            Dictionary<char, int> result = state.GroupBy(x => x).ToDictionary(x => x.Key, x => x.Count());
            int max = result.Values.Max();
            int min = result.Values.Min();
            Console.WriteLine("Max - Min on step 10: " + (max - min));
        }

        // Literally puts the rules into practice on a string, doesn't work for very long
        protected string NaieveStep(string curr)
        {
            StringBuilder result = new StringBuilder();
            for (int i = 1; i < curr.Length; i++)
            {
                string pair = "" + curr[i - 1] + curr[i];
                result.Append(curr[i - 1]);
                if (rules.ContainsKey(pair))
                {
                    result.Append(rules[pair]);
                }
            }
            result.Append(curr[curr.Length - 1]);
            return result.ToString();
        }

        // The not so brute force approach
        public override void Part2()
        {
            Dictionary<string, long> state = pairCounts;
            Dictionary<char, long> elementCounts = new Dictionary<char, long>();

            foreach (char elem in polymerTemplate)
            { // Initialise element counts
                elementCounts[elem] = elementCounts.ContainsKey(elem) ? elementCounts[elem] + 1 : 1;
            }

            for (int i = 0; i < 40; i++)
            { // Do polymerization
                state = FastStep(state, elementCounts);
            }

            long max = elementCounts.Values.Max();
            long min = elementCounts.Values.Min();

            Console.WriteLine("Max - Min on step 40: " + (max - min));

        }

        // Uses dictionaries to count pairs of elements and elements themselves, much faster.
        protected Dictionary<string, long> FastStep(Dictionary<string, long> currPairs, Dictionary<char, long> elemCounts)
        {
            Dictionary<string, long> result = new Dictionary<string, long>();
            foreach (KeyValuePair<string, long> kvp in currPairs)
            {
                // Update element counts, every pair will produce one of the new element.
                char newElem = rules[kvp.Key];
                elemCounts[newElem] = elemCounts.ContainsKey(newElem) ?
                    elemCounts[newElem] + kvp.Value :
                    kvp.Value;

                // Create the two pairs and put them in the resulting dictionary with the new values
                string pair1 = "" + kvp.Key[0] + rules[kvp.Key];
                string pair2 = "" + rules[kvp.Key] + kvp.Key[1];
                result[pair1] = result.ContainsKey(pair1) ? result[pair1] + kvp.Value : kvp.Value;
                result[pair2] = result.ContainsKey(pair2) ? result[pair2] + kvp.Value : kvp.Value;
            }
            return result;
        }
    }
}