# BEM 명명 규칙

> Yum 프로젝트의 모든 프론트엔드 CSS 클래스는 **BEM(Block-Element-Modifier)** 을 따른다.

## 1. 기본 형식

```
block__element--modifier
```

- **Block**: 독립적으로 의미 있는 컴포넌트. (`card`, `swipe-deck`, `button`)
- **Element**: Block의 부분. Block 없이는 의미 없음. (`card__image`, `card__title`)
- **Modifier**: Block 또는 Element의 변형/상태. (`button--primary`, `card--liked`)

### 구분자
- Block ↔ Element: 더블 언더스코어 (`__`)
- Block/Element ↔ Modifier: 더블 하이픈 (`--`)
- 단어 사이: 싱글 하이픈 (`swipe-deck`, NOT `swipeDeck`)

## 2. 예시

```html
<!-- ✅ Good -->
<article class="restaurant-card restaurant-card--liked">
  <img class="restaurant-card__image" src="..." />
  <h2 class="restaurant-card__title">떡볶이상회</h2>
  <span class="restaurant-card__distance restaurant-card__distance--far">1.2km</span>
</article>

<!-- ❌ Bad: camelCase, 중첩 element 표현 X -->
<article class="restaurantCard">
  <img class="restaurant-card__image__inner" />  <!-- element는 한 단계만 -->
</article>
```

## 3. Svelte에서 BEM

Svelte의 `<style>`는 컴포넌트 스코프지만, **클래스명은 BEM을 그대로 사용**한다.
이유: 마크업만 봐도 구조가 읽히고, 향후 글로벌 스타일로 빼기 쉽다.

```svelte
<!-- RestaurantCard.svelte -->
<article class="restaurant-card" class:restaurant-card--liked={isLiked}>
  <img class="restaurant-card__image" {src} alt={name} />
  <h2 class="restaurant-card__title">{name}</h2>
</article>

<style>
  .restaurant-card { /* ... */ }
  .restaurant-card__image { /* ... */ }
  .restaurant-card__title { /* ... */ }
  .restaurant-card--liked { /* ... */ }
</style>
```

> Svelte의 `class:foo={cond}` 디렉티브는 BEM modifier 토글에 잘 어울린다.

## 4. 체크리스트

- [ ] 클래스명에 카멜케이스가 있는가? → 케밥케이스로
- [ ] Element가 두 단계 중첩됐는가? (`block__el1__el2`) → 평면화하거나 하위 Block으로 분리
- [ ] Modifier가 단독으로 쓰였는가? → 항상 base 클래스와 함께 (`card card--liked`)
- [ ] Block 이름이 다른 Block의 부분인가? → 진짜로 독립적인지 검토
