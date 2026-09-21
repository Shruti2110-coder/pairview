function forCandidate(question) {
    const { solution, hints, ...safe } = question;
    return safe;
}

module.exports = { forCandidate };