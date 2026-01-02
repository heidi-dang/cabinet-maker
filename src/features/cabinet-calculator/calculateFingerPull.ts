export function calculateFingerPull(drawerFrontWidth: number) {
    // Rule of thumb: 1/3 drawer width
    const length = Math.round(drawerFrontWidth / 3);

    const offsetFromLeft = Math.round(
        drawerFrontWidth / 2 - length / 2
    );

    return {
        length,
        offsetFromLeft,
    };
}
