const questions = [
{
    id: "merge-intervals",
    title: "Merge intervals",
    prompt:
    "Given a list of intervals, merge every pair that overlaps and return what's left. Example: [[1,3],[2,6],[8,10]] becomes [[1,6],[8,10]].",
    difficulty: "medium",
    topics: ["arrays", "sorting"],
    starterCode: "function merge(intervals) {\n  \n}",
    solution:
    "function merge(intervals) {\n  intervals.sort((a, b) => a[0] - b[0]);\n  const out = [intervals[0]];\n  for (const iv of intervals.slice(1)) {\n    const last = out[out.length - 1];\n    if (iv[0] <= last[1]) {\n      last[1] = Math.max(last[1], iv[1]);\n    } else {\n      out.push(iv);\n    }\n  }\n  return out;\n}",
    hints: [
    "What happens if you sort by start time first?",
    "Compare each interval to the last one you kept.",
    "Two cases only: it overlaps, or it doesn't.",
    ],
    },
];

module.exports = { questions };