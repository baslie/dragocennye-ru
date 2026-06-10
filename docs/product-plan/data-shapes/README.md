# UI Data Shapes

Эти типы определяют форму данных, которую UI-компоненты ожидают получить через props. Это
**контракт фронтенда** — то, что нужно компонентам для корректного рендера, а не схема базы данных.

Как вы моделируете, храните и получаете эти данные на бэкенде — решение реализации. Типы можно
объединять, разбивать или расширять под вашу архитектуру.

## Сущности

Сквозной словарь продукта (см. `product-overview.md` → Product Entities). Одноимённые сущности
(`StoneVariety`, `Cut`, `Origin`, `Treatment`, `Color`) в разных секциях имеют **разный набор полей** —
каждая секция запрашивает ровно то, что ей нужно для рендера. В `overview.ts` они разнесены по
namespace’ам секций именно поэтому.

- **Stone** — конкретный камень в единственном экземпляре (фото/видео, паспорт, цена, наличие). Полная форма — в `stone-detail` (`StoneDetail`), облегчённые проекции — `Stone` (catalog), `SimilarStoneCard`, `LiveStoneCard`, `StoneCard`, `InquiryStoneMini`. _(используется во всех секциях)_
- **StoneVariety** — вид камня (сапфир, изумруд…): категория каталога + справочная статья. _(catalog-browse, stone-detail, encyclopedia)_
- **Cut** — форма огранки (кушон, овал, груша…). _(catalog-browse, stone-detail)_
- **Origin** — месторождение и страна происхождения. _(catalog-browse, stone-detail)_
- **Treatment** — способ облагораживания (негретый, нагретый, промасленный). _(catalog-browse, stone-detail)_
- **Color** — цвет камня со slug и hex. _(catalog-browse, stone-detail)_
- **Certificate** — сертификат лаборатории (`Certificate` краткий в catalog, `StoneCertificate` полный в stone-detail). _(catalog-browse, stone-detail)_
- **CatalogFilters** — текущее состояние боковых фильтров каталога. _(catalog-browse)_
- **StoneMedia / StoneCharacteristics** — медиа-блоки и расширенный паспорт карточки камня. _(stone-detail)_
- **ContactChannel** — канал связи с гемологом (telegram / whatsapp / phone). _(stone-detail, inquiry, blog-and-about)_
- **Inquiry*** — данные модалки заявки: `InquiryStoneMini`, `InquiryChannel`, `InquiryFormValues`, `InquiryFieldErrors`, `InquiryConsent`. _(inquiry)_
- **EncyclopediaEntry** — справочная статья по виду (intro, история, цвета/огранки, как выбирать). _(encyclopedia)_
- **BlogPost / BlogPostCard / PostBlock** — публикация блога: карточка для ленты + тело из блоков (paragraph / heading / quote / image). _(blog-and-about, encyclopedia)_
- **Gemologist** — профиль Дмитрия Салятова: интро, статы, таймлайн, подход, контакты. _(blog-and-about)_
- **Author / Topic / GemologistStat / TimelineItem / GemologistContact** — вспомогательные сущности страницы блога и about. _(blog-and-about)_

## Per-Section Types

Каждая секция включает свой `types.ts` с полными определениями интерфейсов и Props:

- `sections/catalog-browse/types.ts`
- `sections/stone-detail/types.ts`
- `sections/inquiry/types.ts`
- `sections/encyclopedia/types.ts`
- `sections/blog-and-about/types.ts`

## Combined Reference

См. `overview.ts` — все data-сущности агрегированы в одном файле (разнесены по namespace’ам секций).
Props-интерфейсы компонентов туда **не** включены — они остаются в `types.ts` каждой секции.
