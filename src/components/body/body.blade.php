<div class="body typo-rhythm {{ $class }}">
    @if (@$beforeSuptitle)
        <div class="_before-suptitle">{!! $beforeSuptitle !!}</div>
    @endif
    @if (@$suptitle)
        <h5 class="_suptitle typo-suptitle">{{ $suptitle }}</h5>
    @endif
    @if (@$afterSuptitle)
        <div class="_after-suptitle">{!! $afterSuptitle !!}</div>
    @endif

    @if (@$beforeTitle)
        <div class="_before-title">{!! $beforeTitle !!}</div>
    @endif
    @if (@$title)
        <h{{ $titleLevel }} class="_title typo-h{{ $titleLevel }}">{{ $title }}</h{{ $titleLevel }}>
    @endif
    @if (@$afterTitle)
        <div class="_after-title">{!! $afterTitle !!}</div>
    @endif

    @if (@$beforeSubtitle)
        <div class="_before-subtitle">{!! $beforeSubtitle !!}</div>
    @endif
    @if (@$subtitle)
        <h6 class="_subtitle typo-subtitle">{{ $subtitle }}</h6>
    @endif
    @if (@$afterSubtitle)
        <div class="_after-subtitle">{!! $afterSubtitle !!}</div>
    @endif

    @if (@$beforeLead)
        <div class="_before-lead">{!! $beforeLead !!}</div>
    @endif
    @if (@$lead)
        <p class="_lead">{{ $lead }}</p>
    @endif
    @if (@$afterLead)
        <div class="_after-lead">{!! $afterLead !!}</div>
    @endif

    @if (@$beforeText)
        <div class="_before-text">{!! $beforeText !!}</div>
    @endif
    @if (@$text)
        <div class="_text typo-format typo-rhythm">{!! $text !!}</div>
    @endif
    @if (@$afterText)
        <div class="_after-text">{!! $afterText !!}</div>
    @endif

    @if (@$beforeButtons)
        <div class="_before-buttons">{!! $beforeButtons !!}</div>
    @endif
    @if (@$buttons)
        @foreach ($buttons as $button)
            {!! $button->html !!}
        @endforeach
    @endif
    @if (@$afterButtons)
        <div class="_after-buttons">{!! $afterButtons !!}</div>
    @endif
</div>