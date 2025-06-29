
import reducer, {
  setFavoriteCategories,
  toggleDarkMode,
  UserPreferencesState 
} from '../../redux/slices/userPreferencesSlice'

describe('userPreferencesSlice', () => {
  // Test initial state
  it('should return the initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual({
      favoriteCategories: ['technology', 'sports', 'business'],
      darkMode: false,
    });
  });

  // Test setFavoriteCategories action
  it('should handle setFavoriteCategories', () => {
    // Explicitly type the state variable
    let state: UserPreferencesState = { favoriteCategories: [], darkMode: false };
    state = reducer(state, setFavoriteCategories(['science', 'art']));
    expect(state.favoriteCategories).toEqual(['science', 'art']);
  });

  // Test toggleDarkMode action
  it('should handle toggleDarkMode', () => {
    // Explicitly type the state variable
    let state: UserPreferencesState = { favoriteCategories: [], darkMode: false };
    state = reducer(state, toggleDarkMode());
    expect(state.darkMode).toBe(true);

    state = reducer(state, toggleDarkMode());
    expect(state.darkMode).toBe(false);
  });
});