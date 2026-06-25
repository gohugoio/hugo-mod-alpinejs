import Alpine from 'alpinejs';

import anchor from '@alpinejs/anchor';
import collapse from '@alpinejs/collapse';
import focus from '@alpinejs/focus';
import intersect from '@alpinejs/intersect';
import mask from '@alpinejs/mask';
import morph from '@alpinejs/morph';
import persist from '@alpinejs/persist';
import resize from '@alpinejs/resize';
import sort from '@alpinejs/sort';
import ajax from '@imacrayon/alpine-ajax';
import panzoom from 'alpine-panzoom';

window.Alpine = Alpine;

Alpine.plugin(anchor);
Alpine.plugin(collapse);
Alpine.plugin(focus);
Alpine.plugin(intersect);
Alpine.plugin(mask);
Alpine.plugin(morph);
Alpine.plugin(persist);
Alpine.plugin(resize);
Alpine.plugin(sort);
Alpine.plugin(ajax);
Alpine.plugin(panzoom);

Alpine.start();
